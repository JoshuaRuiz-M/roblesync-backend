import { Router } from "express";

import { ProductsRepository } from "./products.repository";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";

import {
    createProductsSchema,
    updateProductsSchema,
    createProductSupplierSchema,
    updateProductSupplierSchema,
    productSupplierParamsSchema,
} from "./products.schema";

import { ProductPermission } from "./products.permissions";

import { authenticate } from "../../../shared/middlewares/authenticate";
import { authorize } from "../../../shared/middlewares/authorize";
import { validateRequest } from "../../../shared/middlewares/validate-request";

import { paginationSchema, numericIdSchema } from "../../../shared/schemas/common.schema";

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

router.get(
    "/:id/suppliers",
    authorize(ProductPermission.PRODUCT_SUPPLIER_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findSuppliers,
);

router.post(
    "/:id/suppliers",
    authorize(ProductPermission.PRODUCT_SUPPLIER_MANAGE),
    validateRequest({
        params: numericIdSchema,
        body: createProductSupplierSchema,
    }),
    controller.addSupplier,
);

router.patch(
    "/:id/suppliers/:supplierId",
    authorize(ProductPermission.PRODUCT_SUPPLIER_MANAGE),
    validateRequest({
        params: productSupplierParamsSchema,
        body: updateProductSupplierSchema,
    }),
    controller.updateSupplier,
);

router.patch(
    "/:id/suppliers/:supplierId/preferred",
    authorize(ProductPermission.PRODUCT_SUPPLIER_MANAGE),
    validateRequest({
        params: productSupplierParamsSchema,
    }),
    controller.setPreferredSupplier,
);

router.delete(
    "/:id/suppliers/:supplierId",
    authorize(ProductPermission.PRODUCT_SUPPLIER_MANAGE),
    validateRequest({
        params: productSupplierParamsSchema,
    }),
    controller.removeSupplier,
);

export default router;
