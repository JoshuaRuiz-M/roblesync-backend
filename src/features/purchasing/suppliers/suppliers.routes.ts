import { Router } from "express";

import { authenticate } from "../../../shared/middlewares/authenticate";
import { authorize } from "../../../shared/middlewares/authorize";
import { validateRequest } from "../../../shared/middlewares/validate-request";

import { createSuppliersSchema, updateSuppliersSchema } from "./suppliers.schema";

import { SupplierPermission } from "./suppliers.permissions";
import { SuppliersRepository } from "./suppliers.repository";
import { SuppliersService } from "./suppliers.service";
import { SuppliersController } from "./suppliers.controller";
import { numericIdSchema, paginationSchema } from "../../../shared/schemas/common.schema";

const router = Router();

const repository = new SuppliersRepository();
const service = new SuppliersService(repository);
const controller = new SuppliersController(service);

router.use(authenticate);

router.get(
    "/",
    authorize(SupplierPermission.SUPPLIER_READ),
    validateRequest({ query: paginationSchema }),
    controller.findAll,
);

router.get("/count", authorize(SupplierPermission.SUPPLIER_READ), controller.count);

router.get(
    "/:id",
    authorize(SupplierPermission.SUPPLIER_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findById,
);

router.post(
    "/",
    authorize(SupplierPermission.SUPPLIER_CREATE),
    validateRequest({ body: createSuppliersSchema }),
    controller.create,
);

router.patch(
    "/:id",
    authorize(SupplierPermission.SUPPLIER_UPDATE),
    validateRequest({
        params: numericIdSchema,
        body: updateSuppliersSchema,
    }),
    controller.update,
);

router.delete(
    "/:id",
    authorize(SupplierPermission.SUPPLIER_DELETE),
    validateRequest({ params: numericIdSchema }),
    controller.delete,
);

export default router;
