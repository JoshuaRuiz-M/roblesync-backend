import { Router } from "express";

import { authenticate } from "../../../shared/middlewares/authenticate";
import { authorize } from "../../../shared/middlewares/authorize";
import { validateRequest } from "../../../shared/middlewares/validate-request";

import { numericIdSchema, paginationSchema } from "../../../shared/schemas/common.schema";

import { createSalesOrderSchema, updateSalesOrderSchema } from "./sales-orders.schema";

import { SalesOrderPermission } from "./sales-orders.permissions";
import { SalesOrdersRepository } from "./sales-orders.repository";
import { SalesOrdersService } from "./sales-orders.service";
import { SalesOrdersController } from "./sales-orders.controller";

const router = Router();

const repository = new SalesOrdersRepository();
const service = new SalesOrdersService(repository);
const controller = new SalesOrdersController(service);

router.use(authenticate);

router.get(
    "/",
    authorize(SalesOrderPermission.SALES_ORDER_READ),
    validateRequest({ query: paginationSchema }),
    controller.findAll,
);

router.post(
    "/",
    authorize(SalesOrderPermission.SALES_ORDER_CREATE),
    validateRequest({ body: createSalesOrderSchema }),
    controller.create,
);

router.get("/count", authorize(SalesOrderPermission.SALES_ORDER_READ), controller.count);

router.get(
    "/:id/details",
    authorize(SalesOrderPermission.SALES_ORDER_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findDetails,
);

router.get(
    "/:id",
    authorize(SalesOrderPermission.SALES_ORDER_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findById,
);

router.patch(
    "/:id",
    authorize(SalesOrderPermission.SALES_ORDER_UPDATE),
    validateRequest({
        params: numericIdSchema,
        body: updateSalesOrderSchema,
    }),
    controller.update,
);

router.patch(
    "/:id/submit",
    authorize(SalesOrderPermission.SALES_ORDER_SUBMIT),
    validateRequest({ params: numericIdSchema }),
    controller.submit,
);

router.patch(
    "/:id/approve",
    authorize(SalesOrderPermission.SALES_ORDER_APPROVE),
    validateRequest({ params: numericIdSchema }),
    controller.approve,
);

router.patch(
    "/:id/reserve",
    authorize(SalesOrderPermission.SALES_ORDER_RESERVE),
    validateRequest({ params: numericIdSchema }),
    controller.reserve,
);

router.patch(
    "/:id/cancel",
    authorize(SalesOrderPermission.SALES_ORDER_CANCEL),
    validateRequest({ params: numericIdSchema }),
    controller.cancel,
);

router.patch(
    "/:id/approve-credit",
    authorize(SalesOrderPermission.SALES_ORDER_CREDIT_APPROVE),
    validateRequest({ params: numericIdSchema }),
    controller.approveCredit,
);

router.patch(
    "/:id/reject-credit",
    authorize(SalesOrderPermission.SALES_ORDER_CREDIT_REJECT),
    validateRequest({ params: numericIdSchema }),
    controller.rejectCredit,
);

export default router;
