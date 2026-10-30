import type { Knex } from "knex";

import { db } from "../../../configurations/database";
import { AppError } from "../../../shared/errors/app-error";
import { HttpStatus } from "../../../shared/constants/http-status";

export interface RegisterPurchaseReceipt {
    warehouse_id: number;
    product_id: number;
    batch_id: number;
    quantity: number;
    unit_cost: number;
    reference_id: number;
    user_id: number;
}

export class InventoryRepository {
    private readonly db: Knex = db;

    async registerPurchaseReceipt(
        trx: Knex.Transaction,
        data: RegisterPurchaseReceipt,
    ): Promise<void> {
        const quantity = this.toQuantity(data.quantity);
        const unitCost = this.toCost(data.unit_cost);

        if (quantity <= 0 || unitCost < 0) {
            throw new AppError(
                HttpStatus.BAD_REQUEST,
                "La cantidad o el costo unitario no son válidos",
            );
        }

        const batch = await trx("inventory.product_batches")
            .where({
                batch_id: data.batch_id,
                product_id: data.product_id,
                is_active: true,
            })
            .first("batch_id");

        if (!batch) {
            throw new AppError(
                HttpStatus.CONFLICT,
                "El lote no existe, está inactivo o no pertenece al producto",
            );
        }

        const warehouseStock = await this.ensureWarehouseStock(
            trx,
            data.warehouse_id,
            data.product_id,
            data.user_id,
        );

        const batchStock = await this.ensureBatchStock(
            trx,
            data.warehouse_id,
            data.product_id,
            data.batch_id,
            data.user_id,
        );

        const previousQuantity = this.toQuantity(warehouseStock.quantity_on_hand);

        const previousMovement = await trx("inventory.inventory_movements")
            .where({
                warehouse_id: data.warehouse_id,
                product_id: data.product_id,
            })
            .orderBy("inventory_movement_id", "desc")
            .first("balance_quantity", "balance_value");

        const previousValue = previousMovement ? this.toMoney(previousMovement.balance_value) : 0;

        if (
            previousMovement &&
            this.toQuantity(previousMovement.balance_quantity) !== previousQuantity
        ) {
            throw new AppError(
                HttpStatus.CONFLICT,
                "El saldo del inventario no coincide con el último movimiento",
            );
        }

        if (!previousMovement && previousQuantity !== 0) {
            throw new AppError(
                HttpStatus.CONFLICT,
                "El inventario tiene existencias sin historial de movimientos",
            );
        }

        const balanceQuantity = this.toQuantity(previousQuantity + quantity);

        const totalCost = this.toMoney(quantity * unitCost);

        const balanceValue = this.toMoney(previousValue + totalCost);

        await trx("inventory.warehouse_stock")
            .where("warehouse_stock_id", warehouseStock.warehouse_stock_id)
            .update({
                quantity_on_hand: balanceQuantity,
                updated_at: trx.raw("SYSUTCDATETIME()"),
                updated_by: data.user_id,
            });

        await trx("inventory.batch_stock")
            .where("batch_stock_id", batchStock.batch_stock_id)
            .update({
                quantity_on_hand: this.toQuantity(Number(batchStock.quantity_on_hand) + quantity),
                updated_at: trx.raw("SYSUTCDATETIME()"),
                updated_by: data.user_id,
            });

        await trx("inventory.inventory_movements").insert({
            warehouse_id: data.warehouse_id,
            product_id: data.product_id,
            batch_id: data.batch_id,
            movement_type: "PURCHASE_RECEIPT",
            movement_date: trx.raw("SYSUTCDATETIME()"),
            quantity,
            unit_cost: unitCost,
            total_cost: totalCost,
            balance_quantity: balanceQuantity,
            balance_value: balanceValue,
            reference_type: "GOODS_RECEIPT",
            reference_id: data.reference_id,
            notes: null,
            created_at: trx.raw("SYSUTCDATETIME()"),
            created_by: data.user_id,
        });
    }

    private async ensureWarehouseStock(
        trx: Knex.Transaction,
        warehouseId: number,
        productId: number,
        userId: number,
    ): Promise<{
        warehouse_stock_id: number;
        quantity_on_hand: number;
    }> {
        const existing = await trx("inventory.warehouse_stock")
            .where({
                warehouse_id: warehouseId,
                product_id: productId,
            })
            .forUpdate()
            .first();

        if (existing) {
            return existing;
        }

        try {
            await trx("inventory.warehouse_stock").insert({
                warehouse_id: warehouseId,
                product_id: productId,
                quantity_on_hand: 0,
                quantity_reserved: 0,
                updated_at: trx.raw("SYSUTCDATETIME()"),
                updated_by: userId,
            });
        } catch (error) {
            if (!this.isUniqueViolation(error)) {
                throw error;
            }
        }

        const stock = await trx("inventory.warehouse_stock")
            .where({
                warehouse_id: warehouseId,
                product_id: productId,
            })
            .forUpdate()
            .first();

        if (!stock) {
            throw new Error("Warehouse stock could not be retrieved");
        }

        return stock;
    }

    private async ensureBatchStock(
        trx: Knex.Transaction,
        warehouseId: number,
        productId: number,
        batchId: number,
        userId: number,
    ): Promise<{
        batch_stock_id: number;
        quantity_on_hand: number;
    }> {
        const existing = await trx("inventory.batch_stock")
            .where({
                warehouse_id: warehouseId,
                batch_id: batchId,
            })
            .forUpdate()
            .first();

        if (existing) {
            return existing;
        }

        try {
            await trx("inventory.batch_stock").insert({
                warehouse_id: warehouseId,
                product_id: productId,
                batch_id: batchId,
                quantity_on_hand: 0,
                quantity_reserved: 0,
                updated_at: trx.raw("SYSUTCDATETIME()"),
                updated_by: userId,
            });
        } catch (error) {
            if (!this.isUniqueViolation(error)) {
                throw error;
            }
        }

        const stock = await trx("inventory.batch_stock")
            .where({
                warehouse_id: warehouseId,
                batch_id: batchId,
            })
            .forUpdate()
            .first();

        if (!stock) {
            throw new Error("Batch stock could not be retrieved");
        }

        return stock;
    }

    async reserveStock(
        trx: Knex.Transaction,
        data: {
            warehouse_id: number;
            product_id: number;
            quantity: number;
            user_id: number;
        },
    ): Promise<void> {
        const quantity = this.toQuantity(data.quantity);

        if (
            !Number.isFinite(data.quantity) ||
            quantity <= 0 ||
            Math.abs(quantity - data.quantity) > 0.000001
        ) {
            throw new AppError(HttpStatus.BAD_REQUEST, "La cantidad a reservar no es válida.");
        }

        const affectedRows = await trx("inventory.warehouse_stock")
            .where({
                warehouse_id: data.warehouse_id,
                product_id: data.product_id,
            })
            .whereRaw("quantity_on_hand - quantity_reserved >= ?", [quantity])
            .increment("quantity_reserved", quantity)
            .update({
                updated_at: trx.raw("SYSUTCDATETIME()"),
                updated_by: data.user_id,
            });

        if (affectedRows === 0) {
            throw new AppError(
                HttpStatus.CONFLICT,
                `No hay inventario suficiente para reservar el producto ${data.product_id}.`,
            );
        }
    }

    async releaseReservedStock(
        trx: Knex.Transaction,
        data: {
            warehouse_id: number;
            product_id: number;
            quantity: number;
            user_id: number;
        },
    ): Promise<void> {
        const quantity = this.toQuantity(data.quantity);

        if (
            !Number.isFinite(data.quantity) ||
            quantity <= 0 ||
            Math.abs(quantity - data.quantity) > 0.000001
        ) {
            throw new AppError(HttpStatus.BAD_REQUEST, "La cantidad a liberar no es válida.");
        }

        const affectedRows = await trx("inventory.warehouse_stock")
            .where({
                warehouse_id: data.warehouse_id,
                product_id: data.product_id,
            })
            .where("quantity_reserved", ">=", quantity)
            .decrement("quantity_reserved", quantity)
            .update({
                updated_at: trx.raw("SYSUTCDATETIME()"),
                updated_by: data.user_id,
            });

        if (affectedRows === 0) {
            throw new AppError(
                HttpStatus.CONFLICT,
                `No se pudo liberar la reserva del producto ${data.product_id}.`,
            );
        }
    }

    private isUniqueViolation(error: unknown): boolean {
        if (typeof error !== "object" || error === null) {
            return false;
        }

        const candidate = error as {
            number?: number;
            originalError?: { number?: number };
        };

        const number = candidate.number ?? candidate.originalError?.number;

        return number === 2601 || number === 2627;
    }

    private toQuantity(value: number): number {
        return Math.round(Number(value) * 1000) / 1000;
    }

    private toCost(value: number): number {
        return Math.round(Number(value) * 10000) / 10000;
    }

    private toMoney(value: number): number {
        return Math.round((Number(value) + Number.EPSILON) * 10000) / 10000;
    }
}
