import { Router } from "express";

import { authenticate } from "../../../shared/middlewares/authenticate";
import { authorize } from "../../../shared/middlewares/authorize";
import { validateRequest } from "../../../shared/middlewares/validate-request";

import {
    createInventoryMovementsSchema,
    updateInventoryMovementsSchema,
} from "./inventory-movements.schema";

import { inventoryMovementPermission } from "./inventory-movements.permission";
import { InventoryMovementsRepository } from "./inventory-movements.repository";
import { InventoryMovementsService } from "./inventory-movements.service";
import { InventoryMovementsController } from "./inventory-movements.controller";
import { numericIdSchema, paginationSchema } from "../../../shared/schemas/common.schema";

const router = Router();
const repository = new InventoryMovementsRepository();
const service = new InventoryMovementsService(repository);
const controller = new InventoryMovementsController(service);

router.use(authenticate);

router.get(
    "/",
    authorize(inventoryMovementPermission.INVENTORY_MOVEMENT_READ),
    validateRequest({ query: paginationSchema }),
    controller.findAll,
);

router.get(
    "/count",
    authorize(inventoryMovementPermission.INVENTORY_MOVEMENT_READ),
    controller.count,
);

router.get(
    "/:id",
    authorize(inventoryMovementPermission.INVENTORY_MOVEMENT_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findById,
);

router.post(
    "/",
    authorize(inventoryMovementPermission.INVENTORY_MOVEMENT_CREATE),
    validateRequest({ body: createInventoryMovementsSchema }),
    controller.create,
);

router.patch(
    "/:id",
    authorize(inventoryMovementPermission.INVENTORY_MOVEMENT_UPDATE),
    validateRequest({
        params: numericIdSchema,
        body: updateInventoryMovementsSchema,
    }),
    controller.update,
);

router.delete(
    "/:id",
    authorize(inventoryMovementPermission.INVENTORY_MOVEMENT_DELETE),
    validateRequest({ params: numericIdSchema }),
    controller.delete,
);

export default router;
