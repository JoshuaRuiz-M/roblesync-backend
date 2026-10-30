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

export interface RegisterSalesIssue {
    warehouse_id: number;
    product_id: number;
    quantity: number;
    reference_id: number;
    user_id: number;
}

export interface RegisterTransferOut {
    warehouse_id: number;
    product_id: number;
    batch_id: number;
    quantity: number;
    reference_id: number;
    user_id: number;
}

export interface RegisterTransferIn {
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

    async registerSalesIssue(trx: Knex.Transaction, data: RegisterSalesIssue): Promise<number> {
        const quantity = this.toQuantity(data.quantity);

        if (
            !Number.isFinite(data.quantity) ||
            quantity <= 0 ||
            Math.abs(quantity - data.quantity) > 0.000001
        ) {
            throw new AppError(HttpStatus.BAD_REQUEST, "La cantidad a despachar no es válida.");
        }

        const warehouseStock = await trx("inventory.warehouse_stock")
            .where({
                warehouse_id: data.warehouse_id,
                product_id: data.product_id,
            })
            .forUpdate()
            .first();

        if (!warehouseStock) {
            throw new AppError(
                HttpStatus.CONFLICT,
                "El producto no tiene existencias en el almacén.",
            );
        }

        const onHand = this.toQuantity(Number(warehouseStock.quantity_on_hand));

        const reserved = this.toQuantity(Number(warehouseStock.quantity_reserved));

        if (reserved < quantity || onHand < quantity) {
            throw new AppError(
                HttpStatus.CONFLICT,
                `No hay existencias reservadas suficientes para el producto ${data.product_id}.`,
            );
        }

        const previousMovement = await trx("inventory.inventory_movements")
            .where({
                warehouse_id: data.warehouse_id,
                product_id: data.product_id,
            })
            .orderBy("inventory_movement_id", "desc")
            .first("balance_quantity", "balance_value");

        if (!previousMovement) {
            throw new AppError(
                HttpStatus.CONFLICT,
                "El producto no tiene historial de movimientos de inventario.",
            );
        }

        const previousQuantity = this.toQuantity(Number(previousMovement.balance_quantity));

        const previousValue = this.toMoney(Number(previousMovement.balance_value));

        if (previousQuantity !== onHand) {
            throw new AppError(
                HttpStatus.CONFLICT,
                "El saldo del inventario no coincide con el último movimiento.",
            );
        }

        const batches = await trx
            .from(trx.raw("[inventory].[batch_stock] AS [bs] WITH (UPDLOCK, ROWLOCK)"))
            .innerJoin("inventory.product_batches as pb", "pb.batch_id", "bs.batch_id")
            .select(
                "bs.batch_stock_id",
                "bs.batch_id",
                "bs.quantity_on_hand",
                "bs.quantity_reserved",
            )
            .where("bs.warehouse_id", data.warehouse_id)
            .andWhere("bs.product_id", data.product_id)
            .andWhere("pb.is_active", true)
            .andWhere("bs.quantity_on_hand", ">", 0).orderByRaw(`
        CASE
            WHEN pb.expiration_date IS NULL THEN 1
            ELSE 0
        END ASC,
        pb.expiration_date ASC,
        pb.received_at ASC,
        bs.batch_id ASC
    `);

        const availableInBatches = this.toQuantity(
            batches.reduce((total, batch) => total + Number(batch.quantity_on_hand), 0),
        );

        if (availableInBatches < quantity) {
            throw new AppError(
                HttpStatus.CONFLICT,
                `No hay existencias disponibles por lote para el producto ${data.product_id}.`,
            );
        }

        // Costo promedio del saldo valorizado del almacén.
        const unitCost = this.toCost(previousValue / onHand);

        let remaining = quantity;
        let balanceQuantity = previousQuantity;
        let balanceValue = previousValue;

        for (const batch of batches) {
            if (remaining <= 0) {
                break;
            }

            const batchAvailable = this.toQuantity(Number(batch.quantity_on_hand));

            if (batchAvailable <= 0) {
                continue;
            }

            const dispatched = this.toQuantity(Math.min(remaining, batchAvailable));

            const movementQuantity = -dispatched;

            const nextBalanceQuantity = this.toQuantity(balanceQuantity - dispatched);

            const nextBalanceValue =
                nextBalanceQuantity === 0
                    ? 0
                    : this.toMoney(balanceValue - this.toMoney(dispatched * unitCost));

            if (nextBalanceValue < 0) {
                throw new AppError(
                    HttpStatus.CONFLICT,
                    "El valor del inventario es insuficiente para registrar la salida.",
                );
            }

            const totalCost = this.toMoney(movementQuantity * unitCost);

            await trx("inventory.batch_stock")
                .where("batch_stock_id", batch.batch_stock_id)
                .update({
                    quantity_on_hand: this.toQuantity(Number(batch.quantity_on_hand) - dispatched),
                    updated_at: trx.raw("SYSUTCDATETIME()"),
                    updated_by: data.user_id,
                });

            await trx("inventory.inventory_movements").insert({
                warehouse_id: data.warehouse_id,
                product_id: data.product_id,
                batch_id: Number(batch.batch_id),
                movement_type: "SALE_DISPATCH",
                movement_date: trx.raw("SYSUTCDATETIME()"),
                quantity: movementQuantity,
                unit_cost: unitCost,
                total_cost: totalCost,
                balance_quantity: nextBalanceQuantity,
                balance_value: nextBalanceValue,
                reference_type: "SALES_INVOICE",
                reference_id: data.reference_id,
                notes: null,
                created_at: trx.raw("SYSUTCDATETIME()"),
                created_by: data.user_id,
            });

            balanceQuantity = nextBalanceQuantity;
            balanceValue = nextBalanceValue;
            remaining = this.toQuantity(remaining - dispatched);
        }

        if (remaining !== 0) {
            throw new AppError(
                HttpStatus.CONFLICT,
                "No fue posible completar la salida de inventario.",
            );
        }

        await trx("inventory.warehouse_stock")
            .where("warehouse_stock_id", warehouseStock.warehouse_stock_id)
            .update({
                quantity_on_hand: balanceQuantity,
                quantity_reserved: this.toQuantity(reserved - quantity),
                updated_at: trx.raw("SYSUTCDATETIME()"),
                updated_by: data.user_id,
            });

        return unitCost;
    }

    async registerTransferOut(trx: Knex.Transaction, data: RegisterTransferOut): Promise<number> {
        const quantity = this.toQuantity(data.quantity);

        if (
            !Number.isFinite(data.quantity) ||
            quantity <= 0 ||
            Math.abs(quantity - data.quantity) > 0.000001
        ) {
            throw new AppError(HttpStatus.BAD_REQUEST, "La cantidad a transferir no es válida.");
        }

        const warehouseStock = await trx
            .from(trx.raw("[inventory].[warehouse_stock] WITH (UPDLOCK, ROWLOCK)"))
            .where({
                warehouse_id: data.warehouse_id,
                product_id: data.product_id,
            })
            .first();

        if (!warehouseStock) {
            throw new AppError(
                HttpStatus.CONFLICT,
                "El producto no tiene existencias en la bodega de origen.",
            );
        }

        const onHand = this.toQuantity(Number(warehouseStock.quantity_on_hand));

        const reserved = this.toQuantity(Number(warehouseStock.quantity_reserved));

        if (onHand - reserved < quantity) {
            throw new AppError(
                HttpStatus.CONFLICT,
                `No hay existencias disponibles para transferir el producto ${data.product_id}.`,
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
                "El lote no existe, está inactivo o no pertenece al producto.",
            );
        }

        const batchStock = await trx
            .from(trx.raw("[inventory].[batch_stock] WITH (UPDLOCK, ROWLOCK)"))
            .where({
                warehouse_id: data.warehouse_id,
                product_id: data.product_id,
                batch_id: data.batch_id,
            })
            .first();

        if (!batchStock) {
            throw new AppError(
                HttpStatus.CONFLICT,
                "El lote no tiene existencias en la bodega de origen.",
            );
        }

        const batchOnHand = this.toQuantity(Number(batchStock.quantity_on_hand));

        const batchReserved = this.toQuantity(Number(batchStock.quantity_reserved));

        if (batchOnHand - batchReserved < quantity) {
            throw new AppError(
                HttpStatus.CONFLICT,
                `No hay existencias suficientes en el lote ${data.batch_id}.`,
            );
        }

        const previousMovement = await trx("inventory.inventory_movements")
            .where({
                warehouse_id: data.warehouse_id,
                product_id: data.product_id,
            })
            .orderBy("inventory_movement_id", "desc")
            .first("balance_quantity", "balance_value");

        if (!previousMovement) {
            throw new AppError(
                HttpStatus.CONFLICT,
                "El producto no tiene historial de movimientos.",
            );
        }

        const previousQuantity = this.toQuantity(Number(previousMovement.balance_quantity));

        const previousValue = this.toMoney(Number(previousMovement.balance_value));

        if (previousQuantity !== onHand) {
            throw new AppError(
                HttpStatus.CONFLICT,
                "El saldo del inventario no coincide con el último movimiento.",
            );
        }

        const unitCost = this.toCost(previousValue / onHand);

        const movementQuantity = -quantity;

        const balanceQuantity = this.toQuantity(onHand - quantity);

        const totalCost = this.toMoney(movementQuantity * unitCost);

        const balanceValue = balanceQuantity === 0 ? 0 : this.toMoney(previousValue + totalCost);

        if (balanceValue < 0) {
            throw new AppError(HttpStatus.CONFLICT, "El valor del inventario es insuficiente.");
        }

        await trx("inventory.batch_stock")
            .where("batch_stock_id", batchStock.batch_stock_id)
            .update({
                quantity_on_hand: this.toQuantity(batchOnHand - quantity),
                updated_at: trx.raw("SYSUTCDATETIME()"),
                updated_by: data.user_id,
            });

        await trx("inventory.warehouse_stock")
            .where("warehouse_stock_id", warehouseStock.warehouse_stock_id)
            .update({
                quantity_on_hand: balanceQuantity,
                updated_at: trx.raw("SYSUTCDATETIME()"),
                updated_by: data.user_id,
            });

        await trx("inventory.inventory_movements").insert({
            warehouse_id: data.warehouse_id,
            product_id: data.product_id,
            batch_id: data.batch_id,
            movement_type: "TRANSFER_OUT",
            movement_date: trx.raw("SYSUTCDATETIME()"),
            quantity: movementQuantity,
            unit_cost: unitCost,
            total_cost: totalCost,
            balance_quantity: balanceQuantity,
            balance_value: balanceValue,
            reference_type: "WAREHOUSE_TRANSFER",
            reference_id: data.reference_id,
            notes: null,
            created_at: trx.raw("SYSUTCDATETIME()"),
            created_by: data.user_id,
        });

        return unitCost;
    }

    async registerTransferIn(trx: Knex.Transaction, data: RegisterTransferIn): Promise<void> {
        const quantity = this.toQuantity(data.quantity);
        const unitCost = this.toCost(data.unit_cost);

        if (
            !Number.isFinite(data.quantity) ||
            quantity <= 0 ||
            Math.abs(quantity - data.quantity) > 0.000001 ||
            !Number.isFinite(data.unit_cost) ||
            unitCost < 0 ||
            Math.abs(unitCost - data.unit_cost) > 0.000001
        ) {
            throw new AppError(
                HttpStatus.BAD_REQUEST,
                "La cantidad o el costo unitario no son válidos.",
            );
        }

        const batch = await trx("inventory.product_batches")
            .where({
                batch_id: data.batch_id,
                product_id: data.product_id,
            })
            .first("batch_id");

        if (!batch) {
            throw new AppError(
                HttpStatus.CONFLICT,
                "El lote no existe o no pertenece al producto.",
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

        const previousQuantity = this.toQuantity(Number(warehouseStock.quantity_on_hand));

        const previousMovement = await trx("inventory.inventory_movements")
            .where({
                warehouse_id: data.warehouse_id,
                product_id: data.product_id,
            })
            .orderBy("inventory_movement_id", "desc")
            .first("balance_quantity", "balance_value");

        const previousValue = previousMovement
            ? this.toMoney(Number(previousMovement.balance_value))
            : 0;

        if (
            previousMovement &&
            this.toQuantity(Number(previousMovement.balance_quantity)) !== previousQuantity
        ) {
            throw new AppError(
                HttpStatus.CONFLICT,
                "El saldo del inventario no coincide con el último movimiento.",
            );
        }

        if (!previousMovement && previousQuantity !== 0) {
            throw new AppError(
                HttpStatus.CONFLICT,
                "El inventario tiene existencias sin historial de movimientos.",
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
            movement_type: "TRANSFER_IN",
            movement_date: trx.raw("SYSUTCDATETIME()"),
            quantity,
            unit_cost: unitCost,
            total_cost: totalCost,
            balance_quantity: balanceQuantity,
            balance_value: balanceValue,
            reference_type: "WAREHOUSE_TRANSFER",
            reference_id: data.reference_id,
            notes: null,
            created_at: trx.raw("SYSUTCDATETIME()"),
            created_by: data.user_id,
        });
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
