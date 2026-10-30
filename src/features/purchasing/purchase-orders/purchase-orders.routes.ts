import { Router } from "express";

import { authenticate } from "../../../shared/middlewares/authenticate";
import { authorize } from "../../../shared/middlewares/authorize";
import { validateRequest } from "../../../shared/middlewares/validate-request";

import { numericIdSchema, paginationSchema } from "../../../shared/schemas/common.schema";

import { createPurchaseOrderSchema, updatePurchaseOrderSchema } from "./purchase-orders.schema";

import { PurchaseOrderPermission } from "./purchase-orders.permissions";
import { PurchaseOrdersController } from "./purchase-orders.controller";

const router = Router();

const controller = new PurchaseOrdersController();

router.use(authenticate);

router.get(
    "/",
    authorize(PurchaseOrderPermission.PURCHASE_ORDER_READ),
    validateRequest({ query: paginationSchema }),
    controller.findAll,
);

router.get("/count", authorize(PurchaseOrderPermission.PURCHASE_ORDER_READ), controller.count);

router.get(
    "/:id",
    authorize(PurchaseOrderPermission.PURCHASE_ORDER_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findById,
);

router.post(
    "/",
    authorize(PurchaseOrderPermission.PURCHASE_ORDER_CREATE),
    validateRequest({ body: createPurchaseOrderSchema }),
    controller.create,
);

router.patch(
    "/:id",
    authorize(PurchaseOrderPermission.PURCHASE_ORDER_UPDATE),
    validateRequest({
        params: numericIdSchema,
        body: updatePurchaseOrderSchema,
    }),
    controller.update,
);

router.patch(
    "/:id/approve",
    authorize(PurchaseOrderPermission.PURCHASE_ORDER_APPROVE),
    validateRequest({ params: numericIdSchema }),
    controller.approve,
);

router.patch(
    "/:id/cancel",
    authorize(PurchaseOrderPermission.PURCHASE_ORDER_CANCEL),
    validateRequest({ params: numericIdSchema }),
    controller.cancel,
);

export default router;
