import { Router } from "express";

import { authenticate } from "../../../shared/middlewares/authenticate";
import { authorize } from "../../../shared/middlewares/authorize";
import { validateRequest } from "../../../shared/middlewares/validate-request";

import { createWarehousesSchema, updateWarehousesSchema } from "./warehouses.schema";

import { WarehousePermission } from "./warehouses.permissions";
import { WarehousesRepository } from "./warehouses.repository";
import { WarehousesService } from "./warehouses.service";
import { WarehousesController } from "./warehouses.controller";
import { numericIdSchema, paginationSchema } from "../../../shared/schemas/common.schema";

const router = Router();

const repository = new WarehousesRepository();
const service = new WarehousesService(repository);
const controller = new WarehousesController(service);

router.use(authenticate);

router.get(
    "/",
    authorize(WarehousePermission.WAREHOUSE_READ),
    validateRequest({ query: paginationSchema }),
    controller.findAll,
);

router.get("/count", authorize(WarehousePermission.WAREHOUSE_READ), controller.count);

router.get(
    "/:id",
    authorize(WarehousePermission.WAREHOUSE_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findById,
);

router.post(
    "/",
    authorize(WarehousePermission.WAREHOUSE_CREATE),
    validateRequest({ body: createWarehousesSchema }),
    controller.create,
);

router.patch(
    "/:id",
    authorize(WarehousePermission.WAREHOUSE_UPDATE),
    validateRequest({
        params: numericIdSchema,
        body: updateWarehousesSchema,
    }),
    controller.update,
);

router.delete(
    "/:id",
    authorize(WarehousePermission.WAREHOUSE_DELETE),
    validateRequest({ params: numericIdSchema }),
    controller.delete,
);

export default router;
