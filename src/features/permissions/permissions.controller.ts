import { BaseController } from "../../shared/controllers/base.controller";
import { PermissionsService } from "./permissions.service";

import type { Permission } from "./permissions.types";

import type { CreatePermissionInput, UpdatePermissionInput } from "./permissions.schema";

export class PermissionsController extends BaseController<
    Permission,
    CreatePermissionInput,
    UpdatePermissionInput
> {
    constructor(service: PermissionsService) {
        super(service);
    }
}
