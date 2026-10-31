import type { Request, Response } from "express";

import { AnalyticsService } from "./analytics.service";

import type {
    KardexFilters,
    KardexSummaryFilters,
    DashboardDateFilters,
    DashboardTopProductsFilters,
    DashboardInventoryAlertsFilters,
} from "./analytics.types";
import { getValidated } from "../../shared/http/validated-request";
import { ApiResponder } from "../../shared/http/api-responder";

export class AnalyticsController {
    constructor(private readonly service: AnalyticsService) {}

    getKardex = async (_req: Request, res: Response): Promise<void> => {
        const filters = getValidated<KardexFilters>(res, "query");

        const result = await this.service.getKardex(filters);

        ApiResponder.paginated(res, result);
    };

    getKardexSummary = async (_req: Request, res: Response): Promise<void> => {
        const filters = getValidated<KardexSummaryFilters>(res, "query");

        const summary = await this.service.getKardexSummary(filters);

        ApiResponder.ok(res, summary);
    };

    getDashboardOverview = async (req: Request, res: Response): Promise<void> => {
        const filters = getValidated<DashboardDateFilters>(res, "query");

        const result = await this.service.getDashboardOverview(filters);

        ApiResponder.ok(res, result);
    };

    getDashboardSalesTrend = async (req: Request, res: Response): Promise<void> => {
        const filters = getValidated<DashboardDateFilters>(res, "query");

        const result = await this.service.getDashboardSalesTrend(filters);

        ApiResponder.ok(res, result);
    };

    getDashboardTopProducts = async (req: Request, res: Response): Promise<void> => {
        const filters = getValidated<DashboardTopProductsFilters>(res, "query");

        const result = await this.service.getDashboardTopProducts(filters);

        ApiResponder.ok(res, result);
    };

    getDashboardSalesByCategory = async (req: Request, res: Response): Promise<void> => {
        const filters = getValidated<DashboardDateFilters>(res, "query");

        const result = await this.service.getDashboardSalesByCategory(filters);

        ApiResponder.ok(res, result);
    };

    getDashboardInventoryAlerts = async (req: Request, res: Response): Promise<void> => {
        const filters = getValidated<DashboardInventoryAlertsFilters>(res, "query");

        const result = await this.service.getDashboardInventoryAlerts(filters);

        ApiResponder.ok(res, result);
    };
}
