import { Router } from "express";

import { authenticate } from "../../../shared/middlewares/authenticate";
import { authorize } from "../../../shared/middlewares/authorize";
import { validateRequest } from "../../../shared/middlewares/validate-request";

import { createCategoriesSchema, updateCategoriesSchema } from "./categories.schema";

import { CategoryPermission } from "./categories.permissions";
import { CategoriesRepository } from "./categories.repository";
import { CategoriesService } from "./categories.service";
import { CategoriesController } from "./categories.controller";
import { numericIdSchema, paginationSchema } from "../../../shared/schemas/common.schema";

const router = Router();
const repository = new CategoriesRepository();
const service = new CategoriesService(repository);
const controller = new CategoriesController(service);

router.use(authenticate);

router.get(
    "/",
    authorize(CategoryPermission.CATEGORY_READ),
    validateRequest({ query: paginationSchema }),
    controller.findAll,
);

router.get("/count", authorize(CategoryPermission.CATEGORY_READ), controller.count);

router.get(
    "/:id",
    authorize(CategoryPermission.CATEGORY_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findById,
);

router.post(
    "/",
    authorize(CategoryPermission.CATEGORY_CREATE),
    validateRequest({ body: createCategoriesSchema }),
    controller.create,
);

router.patch(
    "/:id",
    authorize(CategoryPermission.CATEGORY_UPDATE),
    validateRequest({
        params: numericIdSchema,
        body: updateCategoriesSchema,
    }),
    controller.update,
);

router.delete(
    "/:id",
    authorize(CategoryPermission.CATEGORY_DELETE),
    validateRequest({ params: numericIdSchema }),
    controller.delete,
);

export default router;
