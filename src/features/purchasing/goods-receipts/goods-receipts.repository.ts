import type { Knex } from "knex";

import { createGoodsReceiptSchema, updateGoodsReceiptSchema } from "./goods-receipts.schema";

import type {
    GoodsReceipt,
    GoodsReceiptDetail,
    CreateGoodsReceipt,
    UpdateGoodsReceipt,
    CreateGoodsReceiptDetail,
} from "./goods-receipts.types";
import { BaseRepository } from "../../../shared/repositories/base.repository";
import { AppError } from "../../../shared/errors/app-error";
import { HttpStatus } from "../../../shared/constants/http-status";
import { randomUUID } from "crypto";
import { InventoryRepository } from "../../inventory/repositories/inventory.repository";

type PurchaseOrderRow = {
    purchase_order_id: number;
    status: string;
};

type PurchaseOrderDetailRow = {
    purchase_order_detail_id: number;
    purchase_order_id: number;
    product_id: number;
    quantity: number;
    unit_cost: number;
};

type ResolvedDetail = {
    purchase_order_detail_id: number;
    product_id: number;
    batch_id: number;
    quantity_received: number;
    unit_cost: number;
};

export class GoodsReceiptsRepository extends BaseRepository<
    GoodsReceipt,
    CreateGoodsReceipt,
    UpdateGoodsReceipt
> {
    constructor() {
        super({
            schema: "purchasing",
            table: "goods_receipts",
            primaryKey: "goods_receipt_id",
            columns: [
                "goods_receipt_id",
                "receipt_number",
                "purchase_order_id",
                "warehouse_id",
                "receipt_date",
                "status",
                "notes",
                "confirmed_at",
                "confirmed_by",
                "created_at",
                "created_by",
                "updated_at",
                "updated_by",
            ],
            hasAuditFields: true,
            hasUserFields: true,
            schemas: {
                create: createGoodsReceiptSchema,
                update: updateGoodsReceiptSchema,
            },
        });
    }

    async findDetails(goodsReceiptId: number): Promise<GoodsReceiptDetail[]> {
        return this.db("purchasing.goods_receipt_details")
            .where("goods_receipt_id", goodsReceiptId)
            .select(
                "goods_receipt_detail_id",
                "goods_receipt_id",
                "purchase_order_id",
                "purchase_order_detail_id",
                "batch_id",
                "product_id",
                "quantity_received",
                "unit_cost",
                "created_at",
                "created_by",
            )
            .orderBy("goods_receipt_detail_id", "asc");
    }

    override async create(data: CreateGoodsReceipt, user_id: number): Promise<GoodsReceipt> {
        const validated = createGoodsReceiptSchema.parse(data);

        if (validated.details.length === 0) {
            throw new AppError(
                HttpStatus.BAD_REQUEST,
                "La recepción debe contener al menos un producto",
            );
        }

        const id = await this.db.transaction(async (trx) => {
            await this.validateWarehouse(trx, validated.warehouse_id);

            await this.validatePurchaseOrder(trx, validated.purchase_order_id);

            // Resolver y validar productos, cantidades y lotes.
            const details = await this.resolveDetails(
                trx,
                validated.purchase_order_id,
                validated.details,
                user_id,
            );

            // Crear la cabecera.
            const [created] = await trx("purchasing.goods_receipts")
                .insert({
                    receipt_number: `TMP-${randomUUID()}`,
                    purchase_order_id: validated.purchase_order_id,
                    warehouse_id: validated.warehouse_id,
                    status: "DRAFT",
                    notes: validated.notes ?? null,
                    created_at: trx.raw("SYSUTCDATETIME()"),
                    created_by: user_id,
                })
                .returning("goods_receipt_id");

            const goodsReceiptId = Number(created.goods_receipt_id);

            // Generar el número definitivo.
            const receiptNumber = `REC-${String(goodsReceiptId).padStart(8, "0")}`;

            await trx("purchasing.goods_receipts")
                .where("goods_receipt_id", goodsReceiptId)
                .update({
                    receipt_number: receiptNumber,
                });

            // Registrar los detalles de la recepción.
            await trx("purchasing.goods_receipt_details").insert(
                details.map((detail) => ({
                    goods_receipt_id: goodsReceiptId,
                    purchase_order_id: validated.purchase_order_id,
                    ...detail,
                    created_at: trx.raw("SYSUTCDATETIME()"),
                    created_by: user_id,
                })),
            );

            return goodsReceiptId;
        });

        const entity = await this.findById(id);

        if (!entity) {
            throw new Error("Created goods receipt could not be retrieved");
        }

        return entity;
    }

    override async update(
        id: number,
        data: UpdateGoodsReceipt,
        user_id: number,
    ): Promise<GoodsReceipt | null> {
        const validated = updateGoodsReceiptSchema.parse(data);

        const updated = await this.db.transaction(async (trx) => {
            const receipt = await trx("purchasing.goods_receipts")
                .where("goods_receipt_id", id)
                .forUpdate()
                .first();

            if (!receipt) {
                return false;
            }

            if (receipt.status !== "DRAFT") {
                throw new AppError(
                    HttpStatus.CONFLICT,
                    "Solo se pueden modificar recepciones en borrador",
                );
            }

            if (validated.warehouse_id !== undefined) {
                await this.validateWarehouse(trx, validated.warehouse_id);
            }

            if (validated.details !== undefined) {
                const details = await this.resolveDetails(
                    trx,
                    Number(receipt.purchase_order_id),
                    validated.details,
                    user_id,
                    id,
                );

                await trx("purchasing.goods_receipt_details")
                    .where("goods_receipt_id", id)
                    .delete();

                await trx("purchasing.goods_receipt_details").insert(
                    details.map((detail) => ({
                        goods_receipt_id: id,
                        purchase_order_id: receipt.purchase_order_id,
                        ...detail,
                        created_at: trx.raw("SYSUTCDATETIME()"),
                        created_by: user_id,
                    })),
                );
            }

            const headerUpdates: Record<string, unknown> = {
                updated_at: trx.raw("SYSUTCDATETIME()"),
                updated_by: user_id,
            };

            if (validated.warehouse_id !== undefined) {
                headerUpdates.warehouse_id = validated.warehouse_id;
            }

            if (validated.notes !== undefined) {
                headerUpdates.notes = validated.notes;
            }

            await trx("purchasing.goods_receipts")
                .where("goods_receipt_id", id)
                .update(headerUpdates);

            return true;
        });

        return updated ? this.findById(id) : null;
    }

    private async validateWarehouse(trx: Knex.Transaction, warehouseId: number): Promise<void> {
        const warehouse = await trx("inventory.warehouses")
            .where({
                warehouse_id: warehouseId,
                is_active: true,
            })
            .first("warehouse_id");

        if (!warehouse) {
            throw new AppError(
                HttpStatus.BAD_REQUEST,
                "El almacén seleccionado no existe o está inactivo",
            );
        }
    }

    private async validatePurchaseOrder(
        trx: Knex.Transaction,
        purchaseOrderId: number,
    ): Promise<PurchaseOrderRow> {
        const order = await trx("purchasing.purchase_orders")
            .where("purchase_order_id", purchaseOrderId)
            .first<PurchaseOrderRow>();

        if (!order) {
            throw new AppError(HttpStatus.NOT_FOUND, "La orden de compra no existe");
        }

        if (!["APPROVED", "PARTIALLY_RECEIVED"].includes(order.status)) {
            throw new AppError(
                HttpStatus.CONFLICT,
                "La orden de compra no permite registrar recepciones",
            );
        }

        return order;
    }

    private async resolveDetails(
        trx: Knex.Transaction,
        purchaseOrderId: number,
        details: CreateGoodsReceiptDetail[],
        userId: number,
        excludeReceiptId?: number,
    ): Promise<ResolvedDetail[]> {
        const orderDetails = await trx("purchasing.purchase_order_details")
            .where("purchase_order_id", purchaseOrderId)
            .select<PurchaseOrderDetailRow[]>([
                "purchase_order_detail_id",
                "purchase_order_id",
                "product_id",
                "quantity",
                "unit_cost",
            ]);

        const orderDetailsMap = new Map(
            orderDetails.map((detail) => [Number(detail.purchase_order_detail_id), detail]),
        );

        const confirmedQuery = trx("purchasing.goods_receipt_details as grd")
            .innerJoin(
                "purchasing.goods_receipts as gr",
                "gr.goods_receipt_id",
                "grd.goods_receipt_id",
            )
            .where("gr.purchase_order_id", purchaseOrderId)
            .where("gr.status", "CONFIRMED")
            .groupBy("grd.purchase_order_detail_id")
            .select("grd.purchase_order_detail_id")
            .sum({ total_received: "grd.quantity_received" });

        if (excludeReceiptId !== undefined) {
            confirmedQuery.whereNot("gr.goods_receipt_id", excludeReceiptId);
        }

        const confirmedRows = await confirmedQuery;

        const receivedMap = new Map<number, number>(
            confirmedRows.map((row: Record<string, unknown>) => [
                Number(row.purchase_order_detail_id),
                Number(row.total_received),
            ]),
        );

        const requestedMap = new Map<number, number>();

        for (const detail of details) {
            const detailId = detail.purchase_order_detail_id;

            requestedMap.set(
                detailId,
                (requestedMap.get(detailId) ?? 0) + detail.quantity_received,
            );
        }

        for (const [detailId, requestedQuantity] of requestedMap) {
            const orderDetail = orderDetailsMap.get(detailId);

            if (!orderDetail) {
                throw new AppError(
                    HttpStatus.BAD_REQUEST,
                    `El detalle ${detailId} no pertenece a la orden`,
                );
            }

            const ordered = Number(orderDetail.quantity);
            const confirmed = receivedMap.get(detailId) ?? 0;

            const orderedMillis = Math.round(ordered * 1000);
            const confirmedMillis = Math.round(confirmed * 1000);
            const requestedMillis = Math.round(requestedQuantity * 1000);

            if (confirmedMillis + requestedMillis > orderedMillis) {
                throw new AppError(
                    HttpStatus.CONFLICT,
                    `La cantidad del detalle ${detailId} supera lo pendiente`,
                );
            }
        }

        const resolved: ResolvedDetail[] = [];

        for (const detail of details) {
            const orderDetail = orderDetailsMap.get(detail.purchase_order_detail_id)!;

            const batchId = await this.resolveBatch(
                trx,
                Number(orderDetail.product_id),
                detail,
                userId,
            );

            resolved.push({
                purchase_order_detail_id: detail.purchase_order_detail_id,
                product_id: Number(orderDetail.product_id),
                batch_id: batchId,
                quantity_received: detail.quantity_received,
                unit_cost: Number(orderDetail.unit_cost),
            });
        }

        const combinations = new Set<string>();

        for (const detail of resolved) {
            const key = `${detail.purchase_order_detail_id}:${detail.batch_id}`;

            if (combinations.has(key)) {
                throw new AppError(
                    HttpStatus.BAD_REQUEST,
                    "No se puede repetir el mismo lote en un detalle de recepción",
                );
            }

            combinations.add(key);
        }

        return resolved;
    }

    private async resolveBatch(
        trx: Knex.Transaction,
        productId: number,
        detail: CreateGoodsReceiptDetail,
        userId: number,
    ): Promise<number> {
        const batchNumber = detail.batch_number?.trim();

        if (batchNumber) {
            const existing = await trx("inventory.product_batches")
                .where({
                    product_id: productId,
                    batch_number: batchNumber,
                })
                .first();

            if (existing) {
                if (!existing.is_active) {
                    throw new AppError(HttpStatus.CONFLICT, `El lote ${batchNumber} está inactivo`);
                }

                const manufacturingDate = this.normalizeDate(existing.manufacturing_date);

                const expirationDate = this.normalizeDate(existing.expiration_date);

                if (
                    detail.manufacturing_date &&
                    manufacturingDate &&
                    detail.manufacturing_date !== manufacturingDate
                ) {
                    throw new AppError(
                        HttpStatus.CONFLICT,
                        `La fecha de fabricación no coincide con el lote ${batchNumber}`,
                    );
                }

                if (
                    detail.expiration_date &&
                    expirationDate &&
                    detail.expiration_date !== expirationDate
                ) {
                    throw new AppError(
                        HttpStatus.CONFLICT,
                        `La fecha de vencimiento no coincide con el lote ${batchNumber}`,
                    );
                }

                return Number(existing.batch_id);
            }
        }

        const generatedNumber = batchNumber ?? `AUTO-${crypto.randomUUID()}`;

        const [created] = await trx("inventory.product_batches")
            .insert({
                product_id: productId,
                batch_number: generatedNumber,
                manufacturing_date: detail.manufacturing_date ?? null,
                expiration_date: detail.expiration_date ?? null,
                received_at: trx.raw("SYSUTCDATETIME()"),
                is_active: true,
                created_at: trx.raw("SYSUTCDATETIME()"),
                created_by: userId,
            })
            .returning("batch_id");

        return Number(created.batch_id);
    }

    private normalizeDate(value: unknown): string | null {
        if (value === null) {
            return null;
        }

        if (value instanceof Date) {
            return value.toISOString().slice(0, 10);
        }

        return String(value).slice(0, 10);
    }

    async confirm(id: number, userId: number): Promise<GoodsReceipt> {
        await this.db.transaction(async (trx) => {
            const receipt = await trx("purchasing.goods_receipts")
                .where("goods_receipt_id", id)
                .forUpdate()
                .first();

            if (!receipt) {
                throw new AppError(HttpStatus.NOT_FOUND, "La recepción de mercancías no existe");
            }

            if (receipt.status !== "DRAFT") {
                throw new AppError(
                    HttpStatus.CONFLICT,
                    "Solo se pueden confirmar recepciones en borrador",
                );
            }

            const order = await trx("purchasing.purchase_orders")
                .where("purchase_order_id", receipt.purchase_order_id)
                .forUpdate()
                .first();

            if (!order || !["APPROVED", "PARTIALLY_RECEIVED"].includes(order.status)) {
                throw new AppError(
                    HttpStatus.CONFLICT,
                    "La orden de compra no permite recibir mercancías",
                );
            }

            const details = await trx("purchasing.goods_receipt_details")
                .where("goods_receipt_id", id)
                .select();

            if (details.length === 0) {
                throw new AppError(HttpStatus.CONFLICT, "La recepción no contiene productos");
            }

            const orderDetails = await trx("purchasing.purchase_order_details")
                .where("purchase_order_id", receipt.purchase_order_id)
                .select();

            const receivedRows = await trx("purchasing.goods_receipt_details as grd")
                .innerJoin(
                    "purchasing.goods_receipts as gr",
                    "gr.goods_receipt_id",
                    "grd.goods_receipt_id",
                )
                .where("gr.purchase_order_id", receipt.purchase_order_id)
                .where("gr.status", "CONFIRMED")
                .groupBy("grd.purchase_order_detail_id")
                .select("grd.purchase_order_detail_id")
                .sum({ total: "grd.quantity_received" });

            const receivedMap = new Map<number, number>(
                receivedRows.map((row: Record<string, unknown>) => [
                    Number(row.purchase_order_detail_id),
                    Math.round(Number(row.total) * 1000),
                ]),
            );

            const orderDetailsMap = new Map(
                orderDetails.map((detail) => [Number(detail.purchase_order_detail_id), detail]),
            );

            for (const detail of details) {
                const detailId = Number(detail.purchase_order_detail_id);
                const orderDetail = orderDetailsMap.get(detailId);

                if (!orderDetail) {
                    throw new AppError(
                        HttpStatus.CONFLICT,
                        "La recepción contiene productos ajenos a la orden",
                    );
                }

                const quantity = Math.round(Number(detail.quantity_received) * 1000);

                receivedMap.set(detailId, (receivedMap.get(detailId) ?? 0) + quantity);
            }

            for (const orderDetail of orderDetails) {
                const detailId = Number(orderDetail.purchase_order_detail_id);
                const ordered = Math.round(Number(orderDetail.quantity) * 1000);
                const received = receivedMap.get(detailId) ?? 0;

                if (received > ordered) {
                    throw new AppError(
                        HttpStatus.CONFLICT,
                        `La cantidad recibida supera lo solicitado en el detalle ${detailId}`,
                    );
                }
            }

            const inventory = new InventoryRepository();

            for (const detail of details) {
                await inventory.registerPurchaseReceipt(trx, {
                    warehouse_id: Number(receipt.warehouse_id),
                    product_id: Number(detail.product_id),
                    batch_id: Number(detail.batch_id),
                    quantity: Number(detail.quantity_received),
                    unit_cost: Number(detail.unit_cost),
                    reference_id: id,
                    user_id: userId,
                });
            }

            const fullyReceived = orderDetails.every((detail) => {
                const detailId = Number(detail.purchase_order_detail_id);
                const ordered = Math.round(Number(detail.quantity) * 1000);

                return (receivedMap.get(detailId) ?? 0) === ordered;
            });

            await trx("purchasing.purchase_orders")
                .where("purchase_order_id", receipt.purchase_order_id)
                .update({
                    status: fullyReceived ? "RECEIVED" : "PARTIALLY_RECEIVED",
                    updated_at: trx.raw("SYSUTCDATETIME()"),
                    updated_by: userId,
                });

            await trx("purchasing.goods_receipts")
                .where("goods_receipt_id", id)
                .update({
                    status: "CONFIRMED",
                    confirmed_at: trx.raw("SYSUTCDATETIME()"),
                    confirmed_by: userId,
                    updated_at: trx.raw("SYSUTCDATETIME()"),
                    updated_by: userId,
                });
        });

        const receipt = await this.findById(id);

        if (!receipt) {
            throw new Error("Confirmed goods receipt could not be retrieved");
        }

        return receipt;
    }

    async cancel(id: number, userId: number): Promise<GoodsReceipt> {
        const updated = await this.query()
            .where("goods_receipt_id", id)
            .where("status", "DRAFT")
            .update({
                status: "CANCELLED",
                updated_at: this.db.raw("SYSUTCDATETIME()"),
                updated_by: userId,
            });

        if (updated === 0) {
            const receipt = await this.findById(id);

            throw new AppError(
                receipt ? HttpStatus.CONFLICT : HttpStatus.NOT_FOUND,
                receipt
                    ? "Solo se pueden cancelar recepciones en borrador"
                    : "La recepción de mercancías no existe",
            );
        }

        const receipt = await this.findById(id);

        if (!receipt) {
            throw new Error("Cancelled goods receipt could not be retrieved");
        }

        return receipt;
    }
}
