import type { Request, Response } from "express";

import { AnalyticsService } from "./analytics.service";

import type { KardexFilters, KardexSummaryFilters } from "./analytics.types";
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
}
