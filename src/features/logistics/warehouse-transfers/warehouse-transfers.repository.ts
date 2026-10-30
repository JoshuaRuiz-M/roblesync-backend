import { randomUUID } from "node:crypto";
import type { Knex } from "knex";

import { BaseRepository } from "../../../shared/repositories/base.repository";
import { AppError } from "../../../shared/errors/app-error";
import { HttpStatus } from "../../../shared/constants/http-status";

import {
    createWarehouseTransferSchema,
    updateWarehouseTransferSchema,
} from "./warehouse-transfers.schema";

import type {
    WarehouseTransfer,
    WarehouseTransferDetail,
    CreateWarehouseTransfer,
    UpdateWarehouseTransfer,
    CreateWarehouseTransferDetail,
} from "./warehouse-transfers.types";
import { InventoryRepository } from "../../inventory/repositories/inventory.repository";

export class WarehouseTransfersRepository extends BaseRepository<
    WarehouseTransfer,
    CreateWarehouseTransfer,
    UpdateWarehouseTransfer
> {
    constructor() {
        super({
            schema: "logistics",
            table: "warehouse_transfers",
            primaryKey: "warehouse_transfer_id",
            columns: [
                "warehouse_transfer_id",
                "transfer_number",
                "source_warehouse_id",
                "destination_warehouse_id",
                "transfer_date",
                "status",
                "dispatched_at",
                "dispatched_by",
                "received_at",
                "received_by",
                "notes",
                "created_at",
                "created_by",
                "updated_at",
                "updated_by",
            ],
            hasAuditFields: true,
            hasUserFields: true,
            schemas: {
                create: createWarehouseTransferSchema,
                update: updateWarehouseTransferSchema,
            },
        });
    }

    private badRequest(message: string): AppError {
        return new AppError(HttpStatus.BAD_REQUEST, message);
    }

    private conflict(message: string): AppError {
        return new AppError(HttpStatus.CONFLICT, message);
    }

    private notFound(id: number): AppError {
        return new AppError(HttpStatus.NOT_FOUND, `Transferencia con ID ${id} no encontrada.`);
    }

    async findDetails(warehouseTransferId: number): Promise<WarehouseTransferDetail[]> {
        return this.db("logistics.warehouse_transfer_details")
            .where("warehouse_transfer_id", warehouseTransferId)
            .orderBy("warehouse_transfer_detail_id", "asc")
            .select("*");
    }

    private async validateWarehouses(
        trx: Knex.Transaction,
        sourceWarehouseId: number,
        destinationWarehouseId: number,
    ): Promise<void> {
        if (sourceWarehouseId === destinationWarehouseId) {
            throw this.badRequest("La bodega de origen y destino deben ser diferentes.");
        }

        const warehouses = await trx("inventory.warehouses")
            .whereIn("warehouse_id", [sourceWarehouseId, destinationWarehouseId])
            .where("is_active", true)
            .select("warehouse_id");

        if (warehouses.length !== 2) {
            throw this.badRequest("Las bodegas seleccionadas no existen o están inactivas.");
        }
    }

    private async validateDetails(
        trx: Knex.Transaction,
        details: CreateWarehouseTransferDetail[],
    ): Promise<void> {
        if (details.length === 0) {
            throw this.badRequest("La transferencia debe contener al menos un producto.");
        }

        for (const detail of details) {
            const product = await trx("catalog.products")
                .where({
                    product_id: detail.product_id,
                    is_active: true,
                })
                .first("product_id");

            if (!product) {
                throw this.badRequest(
                    `El producto ${detail.product_id} no existe o está inactivo.`,
                );
            }

            const batch = await trx("inventory.product_batches")
                .where({
                    batch_id: detail.batch_id,
                    product_id: detail.product_id,
                    is_active: true,
                })
                .first("batch_id");

            if (!batch) {
                throw this.badRequest(
                    `El lote ${detail.batch_id} no existe, está inactivo o no pertenece al producto ${detail.product_id}.`,
                );
            }
        }
    }

    override async create(
        data: CreateWarehouseTransfer,
        userId: number,
    ): Promise<WarehouseTransfer> {
        const validated = createWarehouseTransferSchema.parse(data);

        const transferId = await this.db.transaction(async (trx) => {
            await this.validateWarehouses(
                trx,
                validated.source_warehouse_id,
                validated.destination_warehouse_id,
            );

            await this.validateDetails(trx, validated.details);

            const [created] = await trx("logistics.warehouse_transfers")
                .insert({
                    transfer_number: `TMP-${randomUUID()}`,
                    source_warehouse_id: validated.source_warehouse_id,
                    destination_warehouse_id: validated.destination_warehouse_id,
                    transfer_date: trx.raw("SYSUTCDATETIME()"),
                    status: "DRAFT",
                    notes: validated.notes ?? null,
                    created_at: trx.raw("SYSUTCDATETIME()"),
                    created_by: userId,
                })
                .returning("warehouse_transfer_id");

            const id = Number(created.warehouse_transfer_id);

            const transferNumber = `TR-${String(id).padStart(6, "0")}`;

            await trx("logistics.warehouse_transfers").where("warehouse_transfer_id", id).update({
                transfer_number: transferNumber,
            });

            await trx("logistics.warehouse_transfer_details").insert(
                validated.details.map((detail) => ({
                    warehouse_transfer_id: id,
                    product_id: detail.product_id,
                    batch_id: detail.batch_id,
                    quantity: detail.quantity,
                    unit_cost: 0,
                    created_at: trx.raw("SYSUTCDATETIME()"),
                    created_by: userId,
                })),
            );

            return id;
        });

        const transfer = await this.findById(transferId);

        if (!transfer) {
            throw this.notFound(transferId);
        }

        return transfer;
    }

    override async update(
        id: number,
        data: UpdateWarehouseTransfer,
        userId: number,
    ): Promise<WarehouseTransfer | null> {
        const validated = updateWarehouseTransferSchema.parse(data);

        const updated = await this.db.transaction(async (trx) => {
            const existing = await trx("logistics.warehouse_transfers")
                .where("warehouse_transfer_id", id)
                .forUpdate()
                .first();

            if (!existing) {
                return false;
            }

            if (existing.status !== "DRAFT") {
                throw this.conflict("Solo se pueden modificar transferencias en borrador.");
            }

            const sourceWarehouseId =
                validated.source_warehouse_id ?? Number(existing.source_warehouse_id);

            const destinationWarehouseId =
                validated.destination_warehouse_id ?? Number(existing.destination_warehouse_id);

            await this.validateWarehouses(trx, sourceWarehouseId, destinationWarehouseId);

            const headerUpdates: Record<string, unknown> = {
                source_warehouse_id: sourceWarehouseId,
                destination_warehouse_id: destinationWarehouseId,
                updated_at: trx.raw("SYSUTCDATETIME()"),
                updated_by: userId,
            };

            if (validated.notes !== undefined) {
                headerUpdates.notes = validated.notes;
            }

            if (validated.details !== undefined) {
                await this.validateDetails(trx, validated.details);

                await trx("logistics.warehouse_transfer_details")
                    .where("warehouse_transfer_id", id)
                    .delete();

                await trx("logistics.warehouse_transfer_details").insert(
                    validated.details.map((detail) => ({
                        warehouse_transfer_id: id,
                        product_id: detail.product_id,
                        batch_id: detail.batch_id,
                        quantity: detail.quantity,
                        unit_cost: 0,
                        created_at: trx.raw("SYSUTCDATETIME()"),
                        created_by: userId,
                    })),
                );
            }

            await trx("logistics.warehouse_transfers")
                .where("warehouse_transfer_id", id)
                .update(headerUpdates);

            return true;
        });

        return updated ? this.findById(id) : null;
    }

    async cancel(id: number, userId: number): Promise<WarehouseTransfer> {
        const affectedRows = await this.db("logistics.warehouse_transfers")
            .where("warehouse_transfer_id", id)
            .where("status", "DRAFT")
            .update({
                status: "CANCELLED",
                updated_at: this.db.raw("SYSUTCDATETIME()"),
                updated_by: userId,
            });

        if (affectedRows === 0) {
            const existing = await this.findById(id);

            if (!existing) {
                throw this.notFound(id);
            }

            throw this.conflict("Solo se pueden cancelar transferencias en borrador.");
        }

        const transfer = await this.findById(id);

        if (!transfer) {
            throw this.notFound(id);
        }

        return transfer;
    }

    override async delete(_id: number): Promise<boolean> {
        throw this.conflict(
            "Las transferencias no pueden eliminarse físicamente. Utilice la cancelación.",
        );
    }

    async dispatch(id: number, userId: number): Promise<WarehouseTransfer> {
        await this.db.transaction(async (trx) => {
            const transfer = await trx
                .from(trx.raw("[logistics].[warehouse_transfers] WITH (UPDLOCK, HOLDLOCK)"))
                .where("warehouse_transfer_id", id)
                .first();

            if (!transfer) {
                throw this.notFound(id);
            }

            if (transfer.status !== "DRAFT") {
                throw this.conflict("Solo se pueden despachar transferencias en borrador.");
            }

            const details = await trx("logistics.warehouse_transfer_details")
                .where("warehouse_transfer_id", id)
                .orderBy("product_id", "asc")
                .orderBy("batch_id", "asc")
                .select();

            if (details.length === 0) {
                throw this.conflict("La transferencia debe contener al menos un producto.");
            }

            const warehouses = await trx("inventory.warehouses")
                .whereIn("warehouse_id", [
                    transfer.source_warehouse_id,
                    transfer.destination_warehouse_id,
                ])
                .where("is_active", true)
                .select("warehouse_id");

            if (warehouses.length !== 2) {
                throw this.conflict("Las bodegas de origen y destino deben estar activas.");
            }

            const inventory = new InventoryRepository();

            for (const detail of details) {
                const unitCost = await inventory.registerTransferOut(trx, {
                    warehouse_id: Number(transfer.source_warehouse_id),
                    product_id: Number(detail.product_id),
                    batch_id: Number(detail.batch_id),
                    quantity: Number(detail.quantity),
                    reference_id: id,
                    user_id: userId,
                });

                await trx("logistics.warehouse_transfer_details")
                    .where("warehouse_transfer_detail_id", detail.warehouse_transfer_detail_id)
                    .update({
                        unit_cost: unitCost,
                    });
            }

            await trx("logistics.warehouse_transfers")
                .where("warehouse_transfer_id", id)
                .update({
                    status: "IN_TRANSIT",
                    dispatched_at: trx.raw("SYSUTCDATETIME()"),
                    dispatched_by: userId,
                    updated_at: trx.raw("SYSUTCDATETIME()"),
                    updated_by: userId,
                });
        });

        const transfer = await this.findById(id);

        if (!transfer) {
            throw this.notFound(id);
        }

        return transfer;
    }

    async receive(id: number, userId: number): Promise<WarehouseTransfer> {
        await this.db.transaction(async (trx) => {
            const transfer = await trx
                .from(trx.raw("[logistics].[warehouse_transfers] WITH (UPDLOCK, HOLDLOCK)"))
                .where("warehouse_transfer_id", id)
                .first();

            if (!transfer) {
                throw this.notFound(id);
            }

            if (transfer.status !== "IN_TRANSIT") {
                throw this.conflict("Solo se pueden recibir transferencias en tránsito.");
            }

            const details = await trx("logistics.warehouse_transfer_details")
                .where("warehouse_transfer_id", id)
                .orderBy("product_id", "asc")
                .orderBy("batch_id", "asc")
                .select();

            if (details.length === 0) {
                throw this.conflict("La transferencia no contiene productos.");
            }

            const destinationWarehouse = await trx("inventory.warehouses")
                .where({
                    warehouse_id: transfer.destination_warehouse_id,
                    is_active: true,
                })
                .first("warehouse_id");

            if (!destinationWarehouse) {
                throw this.conflict("La bodega de destino no existe o está inactiva.");
            }

            const inventory = new InventoryRepository();

            for (const detail of details) {
                await inventory.registerTransferIn(trx, {
                    warehouse_id: Number(transfer.destination_warehouse_id),
                    product_id: Number(detail.product_id),
                    batch_id: Number(detail.batch_id),
                    quantity: Number(detail.quantity),
                    unit_cost: Number(detail.unit_cost),
                    reference_id: id,
                    user_id: userId,
                });
            }

            await trx("logistics.warehouse_transfers")
                .where("warehouse_transfer_id", id)
                .update({
                    status: "RECEIVED",
                    received_at: trx.raw("SYSUTCDATETIME()"),
                    received_by: userId,
                    updated_at: trx.raw("SYSUTCDATETIME()"),
                    updated_by: userId,
                });
        });

        const transfer = await this.findById(id);

        if (!transfer) {
            throw this.notFound(id);
        }

        return transfer;
    }
}
