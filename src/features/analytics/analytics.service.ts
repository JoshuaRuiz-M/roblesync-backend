import { AnalyticsRepository } from "./analytics.repository";

import type {
    KardexFilters,
    KardexResponse,
    KardexSummary,
    KardexSummaryFilters,
    DashboardDateFilters,
    DashboardTopProductsFilters,
    DashboardInventoryAlertsFilters,
} from "./analytics.types";

export class AnalyticsService {
    constructor(private readonly repository: AnalyticsRepository) {}

    async getKardex(filters: KardexFilters): Promise<KardexResponse> {
        return this.repository.getKardex(filters);
    }

    async getKardexSummary(filters: KardexSummaryFilters): Promise<KardexSummary> {
        return this.repository.getKardexSummary(filters);
    }

    async getDashboardOverview(filters: DashboardDateFilters) {
        return this.repository.getDashboardOverview(filters);
    }

    async getDashboardSalesTrend(filters: DashboardDateFilters) {
        return this.repository.getDashboardSalesTrend(filters);
    }

    async getDashboardTopProducts(filters: DashboardTopProductsFilters) {
        return this.repository.getDashboardTopProducts(filters);
    }

    async getDashboardSalesByCategory(filters: DashboardDateFilters) {
        return this.repository.getDashboardSalesByCategory(filters);
    }

    async getDashboardInventoryAlerts(filters: DashboardInventoryAlertsFilters) {
        return this.repository.getDashboardInventoryAlerts(filters);
    }
}
