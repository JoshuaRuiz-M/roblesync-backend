import { Router } from "express";

import { authenticate } from "../../../shared/middlewares/authenticate";
import { authorize } from "../../../shared/middlewares/authorize";
import { validateRequest } from "../../../shared/middlewares/validate-request";

import { numericIdSchema, paginationSchema } from "../../../shared/schemas/common.schema";

import { WarehouseTransfersPermissions } from "./warehouse-transfers.permissions";

import {
    createWarehouseTransferSchema,
    updateWarehouseTransferSchema,
} from "./warehouse-transfers.schema";

import { WarehouseTransfersRepository } from "./warehouse-transfers.repository";
import { WarehouseTransfersService } from "./warehouse-transfers.service";
import { WarehouseTransfersController } from "./warehouse-transfers.controller";

const router = Router();

const repository = new WarehouseTransfersRepository();
const service = new WarehouseTransfersService(repository);
const controller = new WarehouseTransfersController(service);

router.use(authenticate);

router.get(
    "/",
    authorize(WarehouseTransfersPermissions.WAREHOUSE_TRANSFERS_READ),
    validateRequest({ query: paginationSchema }),
    controller.findAll,
);

router.get(
    "/count",
    authorize(WarehouseTransfersPermissions.WAREHOUSE_TRANSFERS_READ),
    controller.count,
);

router.get(
    "/:id",
    authorize(WarehouseTransfersPermissions.WAREHOUSE_TRANSFERS_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findById,
);

router.get(
    "/:id/details",
    authorize(WarehouseTransfersPermissions.WAREHOUSE_TRANSFERS_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findDetails,
);

router.post(
    "/",
    authorize(WarehouseTransfersPermissions.WAREHOUSE_TRANSFERS_CREATE),
    validateRequest({ body: createWarehouseTransferSchema }),
    controller.create,
);

router.patch(
    "/:id",
    authorize(WarehouseTransfersPermissions.WAREHOUSE_TRANSFERS_UPDATE),
    validateRequest({
        params: numericIdSchema,
        body: updateWarehouseTransferSchema,
    }),
    controller.update,
);

router.patch(
    "/:id/dispatch",
    authorize(WarehouseTransfersPermissions.WAREHOUSE_TRANSFERS_DISPATCH),
    validateRequest({ params: numericIdSchema }),
    controller.dispatch,
);

router.patch(
    "/:id/receive",
    authorize(WarehouseTransfersPermissions.WAREHOUSE_TRANSFERS_RECEIVE),
    validateRequest({ params: numericIdSchema }),
    controller.receive,
);

router.patch(
    "/:id/cancel",
    authorize(WarehouseTransfersPermissions.WAREHOUSE_TRANSFERS_CANCEL),
    validateRequest({ params: numericIdSchema }),
    controller.cancel,
);

export default router;
