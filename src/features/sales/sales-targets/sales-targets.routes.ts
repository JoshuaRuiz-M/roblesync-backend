import { Router } from "express";

import { authenticate } from "../../../shared/middlewares/authenticate";
import { authorize } from "../../../shared/middlewares/authorize";
import { validateRequest } from "../../../shared/middlewares/validate-request";

import { createSalesTargetsSchema, updateSalesTargetsSchema } from "./sales-targets.schema";

import { SaleTarget } from "./sales-targets.permissions";
import { SalespersonsRepository } from "./sales-targets.repository";
import { SalesTargetsService } from "./sales-targets.service";
import { SalesTargetsController } from "./sales-targets.controller";
import { numericIdSchema, paginationSchema } from "../../../shared/schemas/common.schema";

const router = Router();

const repository = new SalespersonsRepository();
const service = new SalesTargetsService(repository);
const controller = new SalesTargetsController(service);

router.use(authenticate);

router.get(
    "/",
    authorize(SaleTarget.SALESTARGET_READ),
    validateRequest({ query: paginationSchema }),
    controller.findAll,
);

router.get("/count", authorize(SaleTarget.SALESTARGET_READ), controller.count);

router.get(
    "/:id",
    authorize(SaleTarget.SALESTARGET_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findById,
);

router.post(
    "/",
    authorize(SaleTarget.SALESTARGET_CREATE),
    validateRequest({ body: createSalesTargetsSchema }),
    controller.create,
);

router.patch(
    "/:id",
    authorize(SaleTarget.SALESTARGET_UPDATE),
    validateRequest({
        params: numericIdSchema,
        body: updateSalesTargetsSchema,
    }),
    controller.update,
);

router.delete(
    "/:id",
    authorize(SaleTarget.SALESTARGET_DELETE),
    validateRequest({ params: numericIdSchema }),
    controller.delete,
);

export default router;
