import { AnalyticsRepository } from "./analytics.repository";

import type {
    KardexFilters,
    KardexResponse,
    KardexSummary,
    KardexSummaryFilters,
} from "./analytics.types";

export class AnalyticsService {
    constructor(private readonly repository: AnalyticsRepository) {}

    async getKardex(filters: KardexFilters): Promise<KardexResponse> {
        return this.repository.getKardex(filters);
    }

    async getKardexSummary(filters: KardexSummaryFilters): Promise<KardexSummary> {
        return this.repository.getKardexSummary(filters);
    }
}
