import type { Knex } from "knex";

import type {
    KardexFilters,
    KardexMovement,
    KardexResponse,
    KardexSummary,
    KardexSummaryFilters,
    DashboardDateFilters,
    DashboardTopProductsFilters,
    DashboardInventoryAlertsFilters,
    DashboardOverview,
    DashboardSalesTrend,
    DashboardTopProduct,
    DashboardSalesByCategory,
    DashboardInventoryAlert,
} from "./analytics.types";
import { db } from "../../configurations/database";

type SqlServerProcedureResult<T> = {
    recordsets: T[][];
};

export class AnalyticsRepository {
    private readonly db: Knex = db;

    async getKardex(filters: KardexFilters): Promise<KardexResponse> {
        const result = await this.db.raw(
            `EXEC analytics.sp_GetKardex
            @ProductId = ?,
            @WarehouseId = ?,
            @BatchId = ?,
            @MovementType = ?,
            @StartDate = ?,
            @EndDate = ?,
            @Page = ?,
            @Limit = ?`,
            [
                filters.product_id ?? null,
                filters.warehouse_id ?? null,
                filters.batch_id ?? null,
                filters.movement_type ?? null,
                filters.start_date ?? null,
                filters.end_date ?? null,
                filters.page,
                filters.limit,
            ],
        );

        const rows = result as Array<KardexMovement | { total: number | string }>;

        const movements = rows.filter(
            (row): row is KardexMovement => "inventory_movement_id" in row,
        );

        const totalRow = rows.find(
            (row): row is { total: number | string } =>
                "total" in row && !("inventory_movement_id" in row),
        );

        const total = Number(totalRow?.total ?? 0);
        const totalPages = Math.ceil(total / filters.limit);

        return {
            data: movements,
            meta: {
                page: filters.page,
                limit: filters.limit,
                total,
                totalPages,
                hasNextPage: filters.page < totalPages,
                hasPreviousPage: filters.page > 1,
            },
        };
    }

    async getKardexSummary(filters: KardexSummaryFilters): Promise<KardexSummary> {
        const result = await this.db.raw(
            `EXEC analytics.sp_GetKardexSummary
                @ProductId = ?,
                @WarehouseId = ?,
                @StartDate = ?,
                @EndDate = ?`,
            [
                filters.product_id,
                filters.warehouse_id,
                filters.start_date ?? null,
                filters.end_date ?? null,
            ],
        );

        const recordsets = this.getRecordsets<KardexSummary>(result);

        const summary = recordsets[0]?.[0];

        if (!summary) {
            throw new Error("El procedimiento almacenado no devolvió el resumen del Kardex.");
        }

        return summary;
    }

    private getRecordsets<T>(result: unknown): T[][] {
        if (Array.isArray(result)) {
            return [result as T[]];
        }

        if (typeof result === "object" && result !== null) {
            const data = result as Partial<SqlServerProcedureResult<T>>;

            if (Array.isArray(data.recordsets)) {
                return data.recordsets;
            }
        }

        throw new Error("La respuesta del procedimiento almacenado no tiene un formato válido.");
    }

    private async executeDashboardProcedure<T>(
        sql: string,
        bindings: Knex.RawBinding[],
    ): Promise<T[]> {
        const result = await this.db.raw(sql, bindings);

        if (Array.isArray(result)) {
            return result as T[];
        }

        if (Array.isArray(result?.recordset)) {
            return result.recordset as T[];
        }

        if (Array.isArray(result?.recordsets?.[0])) {
            return result.recordsets[0] as T[];
        }

        throw new Error("Formato de respuesta SQL no reconocido.");
    }

    async getDashboardOverview(filters: DashboardDateFilters): Promise<DashboardOverview> {
        const rows = await this.executeDashboardProcedure<DashboardOverview>(
            `EXEC analytics.sp_GetDashboardOverview
            @StartDate = ?,
            @EndDate = ?`,
            [filters.start_date ?? null, filters.end_date ?? null],
        );

        if (!rows[0]) {
            throw new Error("No se pudo obtener el resumen del Dashboard.");
        }

        return rows[0];
    }

    async getDashboardSalesTrend(filters: DashboardDateFilters): Promise<DashboardSalesTrend[]> {
        return this.executeDashboardProcedure<DashboardSalesTrend>(
            `EXEC analytics.sp_GetSalesTrend
            @StartDate = ?,
            @EndDate = ?`,
            [filters.start_date ?? null, filters.end_date ?? null],
        );
    }

    async getDashboardTopProducts(
        filters: DashboardTopProductsFilters,
    ): Promise<DashboardTopProduct[]> {
        return this.executeDashboardProcedure<DashboardTopProduct>(
            `EXEC analytics.sp_GetTopSellingProducts
            @StartDate = ?,
            @EndDate = ?,
            @Top = ?`,
            [filters.start_date ?? null, filters.end_date ?? null, filters.top],
        );
    }

    async getDashboardSalesByCategory(
        filters: DashboardDateFilters,
    ): Promise<DashboardSalesByCategory[]> {
        return this.executeDashboardProcedure<DashboardSalesByCategory>(
            `EXEC analytics.sp_GetSalesByCategory
            @StartDate = ?,
            @EndDate = ?`,
            [filters.start_date ?? null, filters.end_date ?? null],
        );
    }

    async getDashboardInventoryAlerts(
        filters: DashboardInventoryAlertsFilters,
    ): Promise<DashboardInventoryAlert[]> {
        return this.executeDashboardProcedure<DashboardInventoryAlert>(
            `EXEC analytics.sp_GetInventoryAlerts
            @ExpirationDays = ?,
            @Top = ?`,
            [filters.expiration_days, filters.top],
        );
    }
}
