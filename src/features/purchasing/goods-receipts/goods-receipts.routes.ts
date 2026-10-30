import { Router } from "express";

import { authenticate } from "../../../shared/middlewares/authenticate";
import { authorize } from "../../../shared/middlewares/authorize";
import { validateRequest } from "../../../shared/middlewares/validate-request";

import { numericIdSchema, paginationSchema } from "../../../shared/schemas/common.schema";

import { createGoodsReceiptSchema, updateGoodsReceiptSchema } from "./goods-receipts.schema";

import { GoodsReceiptPermission } from "./goods-receipts.permissions";
import { GoodsReceiptsRepository } from "./goods-receipts.repository";
import { GoodsReceiptsService } from "./goods-receipts.service";
import { GoodsReceiptsController } from "./goods-receipts.controller";

const router = Router();

const repository = new GoodsReceiptsRepository();
const service = new GoodsReceiptsService(repository);
const controller = new GoodsReceiptsController(service);

router.use(authenticate);

router.get(
    "/",
    authorize(GoodsReceiptPermission.GOODS_RECEIPT_READ),
    validateRequest({ query: paginationSchema }),
    controller.findAll,
);

router.post(
    "/",
    authorize(GoodsReceiptPermission.GOODS_RECEIPT_CREATE),
    validateRequest({ body: createGoodsReceiptSchema }),
    controller.create,
);

router.get("/count", authorize(GoodsReceiptPermission.GOODS_RECEIPT_READ), controller.count);

router.get(
    "/:id/details",
    authorize(GoodsReceiptPermission.GOODS_RECEIPT_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findDetails,
);

router.get(
    "/:id",
    authorize(GoodsReceiptPermission.GOODS_RECEIPT_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findById,
);

router.patch(
    "/:id",
    authorize(GoodsReceiptPermission.GOODS_RECEIPT_UPDATE),
    validateRequest({
        params: numericIdSchema,
        body: updateGoodsReceiptSchema,
    }),
    controller.update,
);

router.patch(
    "/:id/confirm",
    authorize(GoodsReceiptPermission.GOODS_RECEIPT_CONFIRM),
    validateRequest({ params: numericIdSchema }),
    controller.confirm,
);

router.patch(
    "/:id/cancel",
    authorize(GoodsReceiptPermission.GOODS_RECEIPT_CANCEL),
    validateRequest({ params: numericIdSchema }),
    controller.cancel,
);

export default router;
