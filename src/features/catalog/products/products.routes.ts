import { Router } from "express";

import { authenticate } from "../../../shared/middlewares/authenticate";
import { authorize } from "../../../shared/middlewares/authorize";
import { validateRequest } from "../../../shared/middlewares/validate-request";

import { createProductsSchema, updateProductsSchema } from "./products.schema";

import { ProductPermission } from "./products.permissions";
import { ProductsRepository } from "./products.repository";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { numericIdSchema, paginationSchema } from "../../../shared/schemas/common.schema";

const router = Router();

const repository = new ProductsRepository();
const service = new ProductsService(repository);
const controller = new ProductsController(service);

router.use(authenticate);

router.get(
    "/",
    authorize(ProductPermission.PRODUCT_READ),
    validateRequest({ query: paginationSchema }),
    controller.findAll,
);

router.get("/count", authorize(ProductPermission.PRODUCT_READ), controller.count);

router.get(
    "/:id",
    authorize(ProductPermission.PRODUCT_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findById,
);

router.post(
    "/",
    authorize(ProductPermission.PRODUCT_CREATE),
    validateRequest({ body: createProductsSchema }),
    controller.create,
);

router.patch(
    "/:id",
    authorize(ProductPermission.PRODUCT_UPDATE),
    validateRequest({
        params: numericIdSchema,
        body: updateProductsSchema,
    }),
    controller.update,
);

router.delete(
    "/:id",
    authorize(ProductPermission.PRODUCT_DELETE),
    validateRequest({ params: numericIdSchema }),
    controller.delete,
);

export default router;
