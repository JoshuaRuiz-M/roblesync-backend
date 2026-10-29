import { Router } from "express";

import { authenticate } from "../../shared/middlewares/authenticate";
import { authorize } from "../../shared/middlewares/authorize";
import { validateRequest } from "../../shared/middlewares/validate-request";

import { createBrandsSchema, updateBrandsSchema } from "./brands.schema";

import { BrandPermission } from "./brands.permissions";
import { BrandsRepository } from "./brands.repository";
import { BrandsService } from "./brands.service";
import { BrandsController } from "./brands.controller";
import { numericIdSchema, paginationSchema } from "../../shared/schemas/common.schema";

const router = Router();

const repository = new BrandsRepository();
const service = new BrandsService(repository);
const controller = new BrandsController(service);

router.use(authenticate);

router.get(
    "/",
    authorize(BrandPermission.BRAND_READ),
    validateRequest({ query: paginationSchema }),
    controller.findAll,
);

router.get("/count", authorize(BrandPermission.BRAND_READ), controller.count);

router.get(
    "/:id",
    authorize(BrandPermission.BRAND_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findById,
);

router.post(
    "/",
    authorize(BrandPermission.BRAND_CREATE),
    validateRequest({ body: createBrandsSchema }),
    controller.create,
);

router.patch(
    "/:id",
    authorize(BrandPermission.BRAND_UPDATE),
    validateRequest({
        params: numericIdSchema,
        body: updateBrandsSchema,
    }),
    controller.update,
);

router.delete(
    "/:id",
    authorize(BrandPermission.BRAND_DELETE),
    validateRequest({ params: numericIdSchema }),
    controller.delete,
);

export default router;
