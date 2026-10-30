import { randomUUID } from "node:crypto";

import type { Knex } from "knex";

import { PurchaseOrdersRepository } from "./purchase-orders.repository";

import { createPurchaseOrderSchema, updatePurchaseOrderSchema } from "./purchase-orders.schema";

import type { CreatePurchaseOrderInput, UpdatePurchaseOrderInput } from "./purchase-orders.schema";

import type {
    PurchaseOrder,
    PurchaseOrderStatus,
    PurchaseOrderWithDetails,
} from "./purchase-orders.types";

import type { PaginatedResult, PaginationParams } from "../../../shared/http/pagination";

import { HttpStatus } from "../../../shared/constants/http-status";
import { AppError } from "../../../shared/errors/app-error";

const TAX_RATE_PERCENT = 12;
const MAX_AMOUNT_CENTS = 99_999_999_999_999_999n;

type ValidatedDetail = {
    product_id: number;
    quantity: number;
    unit_cost: number;
    discount_amount: number;
};

type CalculatedDetail = ValidatedDetail & {
    subtotal: number;
    tax_amount: number;
    total_amount: number;
};

export class PurchaseOrdersService {
    private readonly repository = new PurchaseOrdersRepository();

    async findAll(params: PaginationParams): Promise<PaginatedResult<PurchaseOrder>> {
        return this.repository.findAll(params);
    }

    async count(): Promise<number> {
        return this.repository.count();
    }

    async findById(id: number): Promise<PurchaseOrderWithDetails> {
        const order = await this.repository.findWithDetails(id);

        if (!order) {
            throw this.notFound(id);
        }

        return order;
    }

    private notFound(id: number): AppError {
        return new AppError(HttpStatus.NOT_FOUND, `Orden de compra con ID ${id} no encontrada.`);
    }

    private badRequest(message: string): AppError {
        return new AppError(HttpStatus.BAD_REQUEST, message);
    }

    private conflict(message: string): AppError {
        return new AppError(HttpStatus.CONFLICT, message);
    }

    private toScaledInteger(value: number, scale: number, field: string): bigint {
        if (!Number.isFinite(value) || value < 0) {
            throw this.badRequest(`El campo ${field} contiene un valor inválido.`);
        }

        const scaled = value * scale;
        const rounded = Math.round(scaled);

        if (!Number.isSafeInteger(rounded) || Math.abs(scaled - rounded) > 0.000001) {
            throw this.badRequest(`El campo ${field} excede la precisión permitida.`);
        }

        return BigInt(rounded);
    }

    private roundDivide(numerator: bigint, denominator: bigint): bigint {
        return (numerator + denominator / 2n) / denominator;
    }

    private assertAmount(amountCents: bigint, field: string): void {
        if (amountCents < 0n || amountCents > MAX_AMOUNT_CENTS) {
            throw this.badRequest(`El importe ${field} excede el límite permitido.`);
        }

        // Los importes que devuelve el servicio se representan
        // como number, por lo que deben conservar precisión.
        if (amountCents > BigInt(Number.MAX_SAFE_INTEGER)) {
            throw this.badRequest(`El importe ${field} excede la precisión de JavaScript.`);
        }
    }

    private calculateDetails(details: ValidatedDetail[]): CalculatedDetail[] {
        return details.map((detail) => {
            const quantityUnits = this.toScaledInteger(detail.quantity, 1_000, "quantity");

            const unitCostUnits = this.toScaledInteger(detail.unit_cost, 10_000, "unit_cost");

            const discountCents = this.toScaledInteger(
                detail.discount_amount,
                100,
                "discount_amount",
            );

            // quantity * unit_cost, redondeado a centavos.
            // 1_000 * 10_000 / 100 = 100_000.
            const grossCents = this.roundDivide(quantityUnits * unitCostUnits, 100_000n);

            if (discountCents > grossCents) {
                throw this.badRequest(
                    `El descuento del producto ${detail.product_id} supera su importe.`,
                );
            }

            const subtotalCents = grossCents - discountCents;

            const taxCents = this.roundDivide(subtotalCents * BigInt(TAX_RATE_PERCENT), 100n);

            const totalCents = subtotalCents + taxCents;

            this.assertAmount(subtotalCents, "subtotal");

            this.assertAmount(taxCents, "tax_amount");

            this.assertAmount(totalCents, "total_amount");

            return {
                ...detail,
                subtotal: Number(subtotalCents) / 100,
                tax_amount: Number(taxCents) / 100,
                total_amount: Number(totalCents) / 100,
            };
        });
    }

    private calculateTotals(details: CalculatedDetail[]) {
        let subtotalCents = 0n;
        let taxCents = 0n;

        for (const detail of details) {
            subtotalCents += this.toScaledInteger(detail.subtotal, 100, "subtotal");

            taxCents += this.toScaledInteger(detail.tax_amount, 100, "tax_amount");
        }

        const totalCents = subtotalCents + taxCents;

        this.assertAmount(subtotalCents, "subtotal");

        this.assertAmount(taxCents, "tax_amount");

        this.assertAmount(totalCents, "total_amount");

        return {
            subtotal: Number(subtotalCents) / 100,
            tax_amount: Number(taxCents) / 100,
            total_amount: Number(totalCents) / 100,
        };
    }

    private async validateSupplier(supplierId: number, trx: Knex.Transaction): Promise<void> {
        const supplier = await trx
            .withSchema("purchasing")
            .table("suppliers")
            .where("supplier_id", supplierId)
            .where("is_active", true)
            .first("supplier_id");

        if (!supplier) {
            throw this.badRequest("El proveedor no existe o se encuentra inactivo.");
        }
    }

    private async validateProducts(
        supplierId: number,
        details: ValidatedDetail[],
        trx: Knex.Transaction,
    ): Promise<void> {
        const productIds = details.map((detail) => detail.product_id);

        const products = await trx
            .withSchema("catalog")
            .table("products")
            .whereIn("product_id", productIds)
            .where("is_active", true)
            .select("product_id");

        const activeProductIds = new Set(products.map((product) => Number(product.product_id)));

        const inactiveOrMissing = productIds.filter(
            (productId) => !activeProductIds.has(productId),
        );

        if (inactiveOrMissing.length > 0) {
            throw this.badRequest(
                `Los productos ${inactiveOrMissing.join(", ")} no existen o están inactivos.`,
            );
        }

        const associations = await trx
            .withSchema("purchasing")
            .table("product_suppliers")
            .where("supplier_id", supplierId)
            .where("is_active", true)
            .whereIn("product_id", productIds)
            .select("product_id");

        const associatedIds = new Set(associations.map((row) => Number(row.product_id)));

        const missingAssociations = productIds.filter((productId) => !associatedIds.has(productId));

        if (missingAssociations.length > 0) {
            throw this.badRequest(
                `Los productos ${missingAssociations.join(", ")} no están asociados al proveedor.`,
            );
        }
    }

    async create(
        data: CreatePurchaseOrderInput,
        userId: number,
    ): Promise<PurchaseOrderWithDetails> {
        const validated = createPurchaseOrderSchema.parse(data);

        return this.repository.transaction(async (trx) => {
            await this.validateSupplier(validated.supplier_id, trx);

            await this.validateProducts(validated.supplier_id, validated.details, trx);

            const details = this.calculateDetails(validated.details);

            const totals = this.calculateTotals(details);

            // order_number es NOT NULL.
            // Se utiliza un valor temporal único.
            const temporaryNumber = `TMP-${randomUUID()}`;

            const purchaseOrderId = await this.repository.createOrder(
                {
                    order_number: temporaryNumber,
                    supplier_id: validated.supplier_id,
                    order_date: trx.raw("SYSUTCDATETIME()"),
                    expected_date: validated.expected_date ?? null,
                    status: "DRAFT",
                    ...totals,
                    notes: validated.notes ?? null,
                    created_at: trx.raw("SYSUTCDATETIME()"),
                    created_by: userId,
                },
                trx,
            );

            // Número comercial basado en IDENTITY.
            const orderNumber = `OC-${String(purchaseOrderId).padStart(6, "0")}`;

            await this.repository.updateOrder(
                purchaseOrderId,
                {
                    order_number: orderNumber,
                },
                trx,
            );

            await this.repository.createDetails(
                details.map((detail) => ({
                    purchase_order_id: purchaseOrderId,
                    ...detail,
                    created_at: trx.raw("SYSUTCDATETIME()"),
                    created_by: userId,
                })),
                trx,
            );

            const order = await this.repository.findWithDetails(purchaseOrderId, trx);

            if (!order) {
                throw new Error("No fue posible recuperar la orden creada.");
            }

            return order;
        });
    }

    async update(
        id: number,
        data: UpdatePurchaseOrderInput,
        userId: number,
    ): Promise<PurchaseOrderWithDetails> {
        const validated = updatePurchaseOrderSchema.parse(data);

        return this.repository.transaction(async (trx) => {
            const existing = await trx
                .withSchema("purchasing")
                .table("purchase_orders")
                .where("purchase_order_id", id)
                .forUpdate()
                .first();

            if (!existing) {
                throw this.notFound(id);
            }

            if (existing.status !== "DRAFT") {
                throw this.conflict("Solo se pueden modificar órdenes en estado borrador.");
            }

            const supplierId = validated.supplier_id ?? Number(existing.supplier_id);

            await this.validateSupplier(supplierId, trx);

            const updateData: Record<string, unknown> = {
                supplier_id: supplierId,
                updated_at: trx.raw("SYSUTCDATETIME()"),
                updated_by: userId,
            };

            if (validated.expected_date !== undefined) {
                updateData.expected_date = validated.expected_date;
            }

            if (validated.notes !== undefined) {
                updateData.notes = validated.notes;
            }

            if (validated.details !== undefined) {
                await this.validateProducts(supplierId, validated.details, trx);

                const details = this.calculateDetails(validated.details);

                const totals = this.calculateTotals(details);

                Object.assign(updateData, totals);

                await this.repository.deleteDetails(id, trx);

                await this.repository.createDetails(
                    details.map((detail) => ({
                        purchase_order_id: id,
                        ...detail,
                        created_at: trx.raw("SYSUTCDATETIME()"),
                        created_by: userId,
                    })),
                    trx,
                );
            } else if (validated.supplier_id !== undefined) {
                // Si cambia el proveedor, validar que
                // todos los productos sigan asociados.
                const existingDetails = await this.repository.findDetails(id, trx);

                await this.validateProducts(
                    supplierId,
                    existingDetails.map((detail) => ({
                        product_id: detail.product_id,
                        quantity: Number(detail.quantity),
                        unit_cost: Number(detail.unit_cost),
                        discount_amount: Number(detail.discount_amount),
                    })),
                    trx,
                );
            }

            await this.repository.updateOrder(id, updateData, trx);

            const updated = await this.repository.findWithDetails(id, trx);

            if (!updated) {
                throw new Error("No fue posible recuperar la orden actualizada.");
            }

            return updated;
        });
    }

    private async changeStatus(
        id: number,
        allowedStatuses: PurchaseOrderStatus[],
        newStatus: PurchaseOrderStatus,
        userId: number,
    ): Promise<PurchaseOrderWithDetails> {
        return this.repository.transaction(async (trx) => {
            const existing = await trx
                .withSchema("purchasing")
                .table("purchase_orders")
                .where("purchase_order_id", id)
                .forUpdate()
                .first();

            if (!existing) {
                throw this.notFound(id);
            }

            if (!allowedStatuses.includes(existing.status)) {
                throw this.conflict(
                    `No se puede cambiar una orden de ${existing.status} a ${newStatus}.`,
                );
            }

            if (newStatus === "APPROVED") {
                const details = await this.repository.findDetails(id, trx);

                if (details.length === 0) {
                    throw this.badRequest("No se puede aprobar una orden sin productos.");
                }

                await this.validateSupplier(Number(existing.supplier_id), trx);

                await this.validateProducts(
                    Number(existing.supplier_id),
                    details.map((detail) => ({
                        product_id: detail.product_id,
                        quantity: Number(detail.quantity),
                        unit_cost: Number(detail.unit_cost),
                        discount_amount: Number(detail.discount_amount),
                    })),
                    trx,
                );
            }

            const affectedRows = await this.repository.updateStatus(
                id,
                existing.status,
                newStatus,
                userId,
                trx,
            );

            if (affectedRows === 0) {
                throw this.conflict("El estado de la orden cambió durante la operación.");
            }

            const updated = await this.repository.findWithDetails(id, trx);

            if (!updated) {
                throw new Error("No fue posible recuperar la orden actualizada.");
            }

            return updated;
        });
    }

    async approve(id: number, userId: number): Promise<PurchaseOrderWithDetails> {
        return this.changeStatus(id, ["DRAFT"], "APPROVED", userId);
    }
    async cancel(id: number, userId: number): Promise<PurchaseOrderWithDetails> {
        return this.changeStatus(id, ["DRAFT", "APPROVED"], "CANCELLED", userId);
    }
}
