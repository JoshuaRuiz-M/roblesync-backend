import { Router } from "express";

import { authenticate } from "../../../shared/middlewares/authenticate";
import { authorize } from "../../../shared/middlewares/authorize";
import { validateRequest } from "../../../shared/middlewares/validate-request";

import { createUnitsOfMeasureSchema, updateUnitsOfMeasureSchema } from "./units-of-measure.schema";

import { UnitOfMeasurePermission } from "./units-of-measure.permissions";
import { UnitsOfMeasureRepository } from "./units-of-measure.repository";
import { UnitsOfMeasureService } from "./units-of-measure.service";
import { UnitsOfMeasureController } from "./units-of-measure.controller";
import { numericIdSchema, paginationSchema } from "../../../shared/schemas/common.schema";

const router = Router();
const repository = new UnitsOfMeasureRepository();
const service = new UnitsOfMeasureService(repository);
const controller = new UnitsOfMeasureController(service);

router.use(authenticate);

router.get(
    "/",
    authorize(UnitOfMeasurePermission.UNIT_OF_MEASURE_READ),
    validateRequest({ query: paginationSchema }),
    controller.findAll,
);

router.get("/count", authorize(UnitOfMeasurePermission.UNIT_OF_MEASURE_READ), controller.count);

router.get(
    "/:id",
    authorize(UnitOfMeasurePermission.UNIT_OF_MEASURE_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findById,
);

router.post(
    "/",
    authorize(UnitOfMeasurePermission.UNIT_OF_MEASURE_CREATE),
    validateRequest({ body: createUnitsOfMeasureSchema }),
    controller.create,
);

router.patch(
    "/:id",
    authorize(UnitOfMeasurePermission.UNIT_OF_MEASURE_UPDATE),
    validateRequest({
        params: numericIdSchema,
        body: updateUnitsOfMeasureSchema,
    }),
    controller.update,
);

router.delete(
    "/:id",
    authorize(UnitOfMeasurePermission.UNIT_OF_MEASURE_DELETE),
    validateRequest({ params: numericIdSchema }),
    controller.delete,
);

export default router;
