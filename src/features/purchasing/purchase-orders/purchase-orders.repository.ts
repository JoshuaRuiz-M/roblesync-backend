import type { Knex } from "knex";

import { db } from "../../../configurations/database";

import {
    createPaginationMeta,
    type PaginatedResult,
    type PaginationParams,
} from "../../../shared/http/pagination";

import type {
    PurchaseOrder,
    PurchaseOrderDetail,
    PurchaseOrderWithDetails,
    PurchaseOrderStatus,
} from "./purchase-orders.types";

export class PurchaseOrdersRepository {
    private readonly db: Knex = db;

    private ordersQuery(trx?: Knex.Transaction): Knex.QueryBuilder {
        return (trx ?? this.db).withSchema("purchasing").table("purchase_orders");
    }

    private detailsQuery(trx?: Knex.Transaction): Knex.QueryBuilder {
        return (trx ?? this.db).withSchema("purchasing").table("purchase_order_details");
    }

    async findAll(params: PaginationParams): Promise<PaginatedResult<PurchaseOrder>> {
        const { page, limit } = params;

        if (
            !Number.isSafeInteger(page) ||
            page < 1 ||
            !Number.isSafeInteger(limit) ||
            limit < 1 ||
            limit > 100
        ) {
            throw new RangeError("Invalid pagination parameters");
        }

        const offset = (page - 1) * limit;

        if (!Number.isSafeInteger(offset)) {
            throw new RangeError("Pagination offset is too large");
        }

        const result = await this.ordersQuery().count({ total: "*" }).first();

        const total = Number(result?.total ?? 0);

        const data = (await this.ordersQuery()
            .select("*")
            .orderBy("purchase_order_id", "desc")
            .limit(limit)
            .offset(offset)) as PurchaseOrder[];

        return {
            data,
            meta: createPaginationMeta(params, total),
        };
    }

    async findById(purchaseOrderId: number, trx?: Knex.Transaction): Promise<PurchaseOrder | null> {
        const order = await this.ordersQuery(trx)
            .select("*")
            .where("purchase_order_id", purchaseOrderId)
            .first();

        return (order as PurchaseOrder | undefined) ?? null;
    }

    async findWithDetails(
        purchaseOrderId: number,
        trx?: Knex.Transaction,
    ): Promise<PurchaseOrderWithDetails | null> {
        const order = await this.findById(purchaseOrderId, trx);

        if (!order) {
            return null;
        }

        const details = (await this.detailsQuery(trx)
            .select("*")
            .where("purchase_order_id", purchaseOrderId)
            .orderBy("purchase_order_detail_id", "asc")) as PurchaseOrderDetail[];

        return {
            ...order,
            details,
        };
    }

    async count(): Promise<number> {
        const result = await this.ordersQuery().count({ total: "*" }).first();

        return Number(result?.total ?? 0);
    }

    async findDetails(
        purchaseOrderId: number,
        trx?: Knex.Transaction,
    ): Promise<PurchaseOrderDetail[]> {
        return this.detailsQuery(trx)
            .select("*")
            .where("purchase_order_id", purchaseOrderId)
            .orderBy("purchase_order_detail_id", "asc");
    }

    async createOrder(data: Record<string, unknown>, trx: Knex.Transaction): Promise<number> {
        const [created] = await this.ordersQuery(trx).insert(data).returning("purchase_order_id");

        return Number(created.purchase_order_id);
    }

    async createDetails(details: Record<string, unknown>[], trx: Knex.Transaction): Promise<void> {
        if (details.length === 0) {
            return;
        }

        await this.detailsQuery(trx).insert(details);
    }

    async updateOrder(
        purchaseOrderId: number,
        data: Record<string, unknown>,
        trx: Knex.Transaction,
    ): Promise<number> {
        return this.ordersQuery(trx).where("purchase_order_id", purchaseOrderId).update(data);
    }

    async deleteDetails(purchaseOrderId: number, trx: Knex.Transaction): Promise<number> {
        return this.detailsQuery(trx).where("purchase_order_id", purchaseOrderId).delete();
    }

    async updateStatus(
        purchaseOrderId: number,
        currentStatus: PurchaseOrderStatus,
        newStatus: PurchaseOrderStatus,
        userId: number,
        trx: Knex.Transaction,
    ): Promise<number> {
        return this.ordersQuery(trx)
            .where("purchase_order_id", purchaseOrderId)
            .where("status", currentStatus)
            .update({
                status: newStatus,
                updated_at: this.db.raw("SYSUTCDATETIME()"),
                updated_by: userId,
            });
    }

    async transaction<T>(callback: (trx: Knex.Transaction) => Promise<T>): Promise<T> {
        return this.db.transaction(callback);
    }
}
