import { Router } from "express";

import { authenticate } from "../../../shared/middlewares/authenticate";
import { authorize } from "../../../shared/middlewares/authorize";
import { validateRequest } from "../../../shared/middlewares/validate-request";

import { numericIdSchema, paginationSchema } from "../../../shared/schemas/common.schema";

import { createPriceListSchema, updatePriceListSchema } from "./price-lists.schema";

import { PriceListPermission } from "./price-lists.permissions";
import { PriceListsRepository } from "./price-lists.repository";
import { PriceListsService } from "./price-lists.service";
import { PriceListsController } from "./price-lists.controller";

const router = Router();

const repository = new PriceListsRepository();
const service = new PriceListsService(repository);
const controller = new PriceListsController(service);

router.use(authenticate);

router.get(
    "/",
    authorize(PriceListPermission.PRICE_LIST_READ),
    validateRequest({ query: paginationSchema }),
    controller.findAll,
);

router.post(
    "/",
    authorize(PriceListPermission.PRICE_LIST_CREATE),
    validateRequest({ body: createPriceListSchema }),
    controller.create,
);

router.get("/count", authorize(PriceListPermission.PRICE_LIST_READ), controller.count);

router.get(
    "/:id/details",
    authorize(PriceListPermission.PRICE_LIST_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findDetails,
);

router.get(
    "/:id",
    authorize(PriceListPermission.PRICE_LIST_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findById,
);

router.patch(
    "/:id",
    authorize(PriceListPermission.PRICE_LIST_UPDATE),
    validateRequest({
        params: numericIdSchema,
        body: updatePriceListSchema,
    }),
    controller.update,
);

router.delete(
    "/:id",
    authorize(PriceListPermission.PRICE_LIST_DELETE),
    validateRequest({ params: numericIdSchema }),
    controller.delete,
);

export default router;
