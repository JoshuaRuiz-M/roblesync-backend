import { Router } from "express";

import {
    kardexQuerySchema,
    kardexSummaryQuerySchema,
    dashboardDateFiltersSchema,
    dashboardTopProductsSchema,
    dashboardInventoryAlertsSchema,
} from "./analytics.schema";

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

router.get(
    "/dashboard/overview",
    authorize(AnalyticsPermissions.ANALYTICS_DASHBOARD_READ),
    validateRequest({ query: dashboardDateFiltersSchema }),
    controller.getDashboardOverview,
);

router.get(
    "/dashboard/sales-trend",
    authorize(AnalyticsPermissions.ANALYTICS_DASHBOARD_READ),
    validateRequest({ query: dashboardDateFiltersSchema }),
    controller.getDashboardSalesTrend,
);

router.get(
    "/dashboard/top-products",
    authorize(AnalyticsPermissions.ANALYTICS_DASHBOARD_READ),
    validateRequest({ query: dashboardTopProductsSchema }),
    controller.getDashboardTopProducts,
);

router.get(
    "/dashboard/sales-by-category",
    authorize(AnalyticsPermissions.ANALYTICS_DASHBOARD_READ),
    validateRequest({ query: dashboardDateFiltersSchema }),
    controller.getDashboardSalesByCategory,
);

router.get(
    "/dashboard/inventory-alerts",
    authorize(AnalyticsPermissions.ANALYTICS_DASHBOARD_READ),
    validateRequest({ query: dashboardInventoryAlertsSchema }),
    controller.getDashboardInventoryAlerts,
);

export default router;
