import { Router } from "express";

import { authenticate } from "../../shared/middlewares/authenticate";
import { authorize } from "../../shared/middlewares/authorize";
import { validateRequest } from "../../shared/middlewares/validate-request";

import { createPermissionSchema, updatePermissionSchema } from "./permissions.schema";

import { PermissionPermission } from "./permissions.permissions";
import { PermissionsRepository } from "./permissions.repository";
import { PermissionsService } from "./permissions.service";
import { PermissionsController } from "./permissions.controller";
import { numericIdSchema, paginationSchema } from "../../shared/schemas/common.schema";

const router = Router();

const repository = new PermissionsRepository();
const service = new PermissionsService(repository);
const controller = new PermissionsController(service);

router.use(authenticate);

router.get(
    "/",
    authorize(PermissionPermission.PERMISSION_READ),
    validateRequest({ query: paginationSchema }),
    controller.findAll,
);

router.get("/count", authorize(PermissionPermission.PERMISSION_READ), controller.count);

router.get(
    "/:id",
    authorize(PermissionPermission.PERMISSION_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findById,
);

router.post(
    "/",
    authorize(PermissionPermission.PERMISSION_CREATE),
    validateRequest({ body: createPermissionSchema }),
    controller.create,
);

router.patch(
    "/:id",
    authorize(PermissionPermission.PERMISSION_UPDATE),
    validateRequest({
        params: numericIdSchema,
        body: updatePermissionSchema,
    }),
    controller.update,
);

router.delete(
    "/:id",
    authorize(PermissionPermission.PERMISSION_DELETE),
    validateRequest({ params: numericIdSchema }),
    controller.delete,
);

export default router;
