import { Router } from "express";

import { authenticate } from "../../../shared/middlewares/authenticate";
import { authorize } from "../../../shared/middlewares/authorize";
import { validateRequest } from "../../../shared/middlewares/validate-request";

import { createproductLinesSchema, updateproductLinesSchema } from "./product-lines.schema";

import { ProductLinesPermission } from "./product-lines.permissions";
import { ProductLinesRepository } from "./product-lines.repository";
import { ProductLinesService } from "./product-lines.service";
import { ProductLinesController } from "./product-lines.controller";
import { numericIdSchema, paginationSchema } from "../../../shared/schemas/common.schema";

const router = Router();

const repository = new ProductLinesRepository();
const service = new ProductLinesService(repository);
const controller = new ProductLinesController(service);

router.use(authenticate);

router.get(
    "/",
    authorize(ProductLinesPermission.PRODUCT_LINE_READ),
    validateRequest({ query: paginationSchema }),
    controller.findAll,
);

router.get("/count", authorize(ProductLinesPermission.PRODUCT_LINE_READ), controller.count);

router.get(
    "/:id",
    authorize(ProductLinesPermission.PRODUCT_LINE_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findById,
);

router.post(
    "/",
    authorize(ProductLinesPermission.PRODUCT_LINE_CREATE),
    validateRequest({ body: createproductLinesSchema }),
    controller.create,
);

router.patch(
    "/:id",
    authorize(ProductLinesPermission.PRODUCT_LINE_UPDATE),
    validateRequest({
        params: numericIdSchema,
        body: updateproductLinesSchema,
    }),
    controller.update,
);

router.delete(
    "/:id",
    authorize(ProductLinesPermission.PRODUCT_LINE_DELETE),
    validateRequest({ params: numericIdSchema }),
    controller.delete,
);

export default router;
