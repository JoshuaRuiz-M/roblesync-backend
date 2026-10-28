import { Router } from "express";

import { RolesRepository } from "./roles.repository";
import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";

import {
    createRoleSchema,
    syncRoleMenuItemsSchema,
    syncRolePermissionsSchema,
    updateRoleSchema,
} from "./roles.schema";

import { RolePermission } from "./roles.permissions";

import { authenticate } from "../../shared/middlewares/authenticate";
import { authorize } from "../../shared/middlewares/authorize";
import { validateRequest } from "../../shared/middlewares/validate-request";

import { paginationSchema, numericIdSchema } from "../../shared/schemas/common.schema";

const router = Router();

const repository = new RolesRepository();
const service = new RolesService(repository);
const controller = new RolesController(service);

router.use(authenticate);

router.get(
    "/",
    authorize(RolePermission.ROLE_READ),
    validateRequest({ query: paginationSchema }),
    controller.findAll,
);

router.get("/count", authorize(RolePermission.ROLE_READ), controller.count);

router.get(
    "/:id",
    authorize(RolePermission.ROLE_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findById,
);

router.post(
    "/",
    authorize(RolePermission.ROLE_CREATE),
    validateRequest({ body: createRoleSchema }),
    controller.create,
);

router.patch(
    "/:id",
    authorize(RolePermission.ROLE_UPDATE),
    validateRequest({
        params: numericIdSchema,
        body: updateRoleSchema,
    }),
    controller.update,
);

router.delete(
    "/:id",
    authorize(RolePermission.ROLE_DELETE),
    validateRequest({ params: numericIdSchema }),
    controller.delete,
);

router.get(
    "/:id/menu-items",
    authorize(RolePermission.ROLE_MENU_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findMenuItems,
);

router.put(
    "/:id/menu-items",
    authorize(RolePermission.ROLE_MENU_SYNC),
    validateRequest({
        params: numericIdSchema,
        body: syncRoleMenuItemsSchema,
    }),
    controller.syncMenuItems,
);

router.get(
    "/:id/permissions",
    authorize(RolePermission.ROLE_PERMISSION_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findPermissions,
);

router.put(
    "/:id/permissions",
    authorize(RolePermission.ROLE_PERMISSION_SYNC),
    validateRequest({
        params: numericIdSchema,
        body: syncRolePermissionsSchema,
    }),
    controller.syncPermissions,
);

export default router;
