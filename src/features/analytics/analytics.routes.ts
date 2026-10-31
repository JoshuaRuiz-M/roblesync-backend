import { Router } from "express";

import { kardexQuerySchema, kardexSummaryQuerySchema } from "./analytics.schema";

import { AnalyticsPermissions } from "./analytics.permissions";

import { AnalyticsRepository } from "./analytics.repository";
import { AnalyticsService } from "./analytics.service";
import { AnalyticsController } from "./analytics.controller";
import { authenticate } from "../../shared/middlewares/authenticate";
import { authorize } from "../../shared/middlewares/authorize";
import { validateRequest } from "../../shared/middlewares/validate-request";

const router = Router();

const repository = new AnalyticsRepository();
const service = new AnalyticsService(repository);
const controller = new AnalyticsController(service);

router.use(authenticate);

router.get(
    "/movements",
    authorize(AnalyticsPermissions.ANALYTICS_KARDEX_READ),
    validateRequest({ query: kardexQuerySchema }),
    controller.getKardex,
);

router.get(
    "/summary",
    authorize(AnalyticsPermissions.ANALYTICS_KARDEX_READ),
    validateRequest({ query: kardexSummaryQuerySchema }),
    controller.getKardexSummary,
);

export default router;
