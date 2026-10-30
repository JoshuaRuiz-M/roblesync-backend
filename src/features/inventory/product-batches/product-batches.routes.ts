import { Router } from "express";

import { authenticate } from "../../../shared/middlewares/authenticate";
import { authorize } from "../../../shared/middlewares/authorize";
import { validateRequest } from "../../../shared/middlewares/validate-request";

import { createproductBatchesSchema, updateproductBatchesSchema } from "./product-batches.schema";

import { ProductBatchePermission } from "./product-batches.permissions";
import { ProductBatchesRepository } from "./product-batches.repository";
import { ProductBatchesService } from "./product-batches.service";
import { ProductBatchesController } from "./product-batches.controller";
import { numericIdSchema, paginationSchema } from "../../../shared/schemas/common.schema";

const router = Router();

const repository = new ProductBatchesRepository();
const service = new ProductBatchesService(repository);
const controller = new ProductBatchesController(service);

router.use(authenticate);

router.get(
    "/",
    authorize(ProductBatchePermission.PRODUCT_BATCH_READ),
    validateRequest({ query: paginationSchema }),
    controller.findAll,
);

router.get("/count", authorize(ProductBatchePermission.PRODUCT_BATCH_READ), controller.count);

router.get(
    "/:id",
    authorize(ProductBatchePermission.PRODUCT_BATCH_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findById,
);

router.post(
    "/",
    authorize(ProductBatchePermission.PRODUCT_BATCH_CREATE),
    validateRequest({ body: createproductBatchesSchema }),
    controller.create,
);

router.patch(
    "/:id",
    authorize(ProductBatchePermission.PRODUCT_BATCH_UPDATE),
    validateRequest({
        params: numericIdSchema,
        body: updateproductBatchesSchema,
    }),
    controller.update,
);

router.delete(
    "/:id",
    authorize(ProductBatchePermission.PRODUCT_BATCH_DELETE),
    validateRequest({ params: numericIdSchema }),
    controller.delete,
);

export default router;
