import { Router } from "express";

import { authenticate } from "../../shared/middlewares/authenticate";
import { authorize } from "../../shared/middlewares/authorize";
import { validateRequest } from "../../shared/middlewares/validate-request";

import { createUserSchema, updateUserSchema, syncUserRolesSchema } from "./users.schema";

import { UserPermission } from "./users.permissions";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { numericIdSchema, paginationSchema } from "../../shared/schemas/common.schema";

const router = Router();

const repository = new UsersRepository();
const service = new UsersService(repository);
const controller = new UsersController(service);

router.use(authenticate);

router.get(
    "/",
    authorize(UserPermission.USER_READ),
    validateRequest({ query: paginationSchema }),
    controller.findAll,
);

router.get("/count", authorize(UserPermission.USER_READ), controller.count);

router.get(
    "/:id",
    authorize(UserPermission.USER_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findById,
);

router.post(
    "/",
    authorize(UserPermission.USER_CREATE),
    validateRequest({ body: createUserSchema }),
    controller.create,
);

router.patch(
    "/:id",
    authorize(UserPermission.USER_UPDATE),
    validateRequest({
        params: numericIdSchema,
        body: updateUserSchema,
    }),
    controller.update,
);

router.delete(
    "/:id",
    authorize(UserPermission.USER_DELETE),
    validateRequest({ params: numericIdSchema }),
    controller.delete,
);

router.get(
    "/:id/roles",
    authorize(UserPermission.USER_ROLE_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findRoles,
);

router.put(
    "/:id/roles",
    authorize(UserPermission.USER_ROLE_SYNC),
    validateRequest({
        params: numericIdSchema,
        body: syncUserRolesSchema,
    }),
    controller.syncRoles,
);

router.get(
    "/:id/menu-items",
    authorize(UserPermission.USER_MENU_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findMenuItems,
);

export default router;
