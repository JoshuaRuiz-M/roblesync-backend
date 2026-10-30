import { Router } from "express";

import { authenticate } from "../../../shared/middlewares/authenticate";
import { authorize } from "../../../shared/middlewares/authorize";
import { validateRequest } from "../../../shared/middlewares/validate-request";

import { createSalespersonsSchema, updateSalespersonsSchema } from "./salespersons.schema";

import { SalepersonPermissions } from "./salespersons.permissions";
import { SalespersonsRepository } from "./salespersons.repository";
import { SalespersonsService } from "./salespersons.service";
import { SalespersonsController } from "./salespersons.controller";
import { numericIdSchema, paginationSchema } from "../../../shared/schemas/common.schema";

const router = Router();

const repository = new SalespersonsRepository();
const service = new SalespersonsService(repository);
const controller = new SalespersonsController(service);

router.use(authenticate);

router.get(
    "/",
    authorize(SalepersonPermissions.SALESPERSON_READ),
    validateRequest({ query: paginationSchema }),
    controller.findAll,
);

router.get("/count", authorize(SalepersonPermissions.SALESPERSON_READ), controller.count);

router.get(
    "/:id",
    authorize(SalepersonPermissions.SALESPERSON_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findById,
);

router.post(
    "/",
    authorize(SalepersonPermissions.SALESPERSON_CREATE),
    validateRequest({ body: createSalespersonsSchema }),
    controller.create,
);

router.patch(
    "/:id",
    authorize(SalepersonPermissions.SALESPERSON_UPDATE),
    validateRequest({
        params: numericIdSchema,
        body: updateSalespersonsSchema,
    }),
    controller.update,
);

router.delete(
    "/:id",
    authorize(SalepersonPermissions.SALESPERSON_DELETE),
    validateRequest({ params: numericIdSchema }),
    controller.delete,
);

export default router;
