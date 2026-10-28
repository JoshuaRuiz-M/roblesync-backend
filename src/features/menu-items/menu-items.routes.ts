import { Router } from "express";

import { MenuItemsRepository } from "./menu-items.repository";
import { MenuItemsService } from "./menu-items.service";
import { MenuItemsController } from "./menu-items.controller";

import { createMenuItemSchema, updateMenuItemSchema } from "./menu-items.schema";

import { MenuItemPermission } from "./menu-items.permissions";

import { authenticate } from "../../shared/middlewares/authenticate";
import { authorize } from "../../shared/middlewares/authorize";
import { validateRequest } from "../../shared/middlewares/validate-request";

import { paginationSchema, numericIdSchema } from "../../shared/schemas/common.schema";

const router = Router();

const repository = new MenuItemsRepository();
const service = new MenuItemsService(repository);
const controller = new MenuItemsController(service);

router.use(authenticate);

router.get(
    "/",
    authorize(MenuItemPermission.MENU_ITEM_READ),
    validateRequest({ query: paginationSchema }),
    controller.findAll,
);

router.get("/count", authorize(MenuItemPermission.MENU_ITEM_READ), controller.count);

router.get(
    "/:id",
    authorize(MenuItemPermission.MENU_ITEM_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findById,
);

router.post(
    "/",
    authorize(MenuItemPermission.MENU_ITEM_CREATE),
    validateRequest({ body: createMenuItemSchema }),
    controller.create,
);

router.patch(
    "/:id",
    authorize(MenuItemPermission.MENU_ITEM_UPDATE),
    validateRequest({
        params: numericIdSchema,
        body: updateMenuItemSchema,
    }),
    controller.update,
);

router.delete(
    "/:id",
    authorize(MenuItemPermission.MENU_ITEM_DELETE),
    validateRequest({ params: numericIdSchema }),
    controller.delete,
);

export default router;
