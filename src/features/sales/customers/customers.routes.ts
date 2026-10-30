import { Router } from "express";

import { authenticate } from "../../../shared/middlewares/authenticate";
import { authorize } from "../../../shared/middlewares/authorize";
import { validateRequest } from "../../../shared/middlewares/validate-request";

import { createCustomersSchema, updateCustomersSchema } from "./customers.schema";

import { CustomerPermissions } from "./customers.permissions";
import { CustomersRepository } from "./customers.repository";
import { CustomersService } from "./customers.service";
import { CustomersController } from "./customers.controller";
import { numericIdSchema, paginationSchema } from "../../../shared/schemas/common.schema";

const router = Router();

const repository = new CustomersRepository();
const service = new CustomersService(repository);
const controller = new CustomersController(service);

router.use(authenticate);

router.get(
    "/",
    authorize(CustomerPermissions.CUSTOMER_READ),
    validateRequest({ query: paginationSchema }),
    controller.findAll,
);

router.get("/count", authorize(CustomerPermissions.CUSTOMER_READ), controller.count);

router.get(
    "/:id",
    authorize(CustomerPermissions.CUSTOMER_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findById,
);

router.post(
    "/",
    authorize(CustomerPermissions.CUSTOMER_CREATE),
    validateRequest({ body: createCustomersSchema }),
    controller.create,
);

router.patch(
    "/:id",
    authorize(CustomerPermissions.CUSTOMER_UPDATE),
    validateRequest({
        params: numericIdSchema,
        body: updateCustomersSchema,
    }),
    controller.update,
);

router.delete(
    "/:id",
    authorize(CustomerPermissions.CUSTOMER_DELETE),
    validateRequest({ params: numericIdSchema }),
    controller.delete,
);

export default router;
