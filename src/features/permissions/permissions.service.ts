import { BaseService } from "../../shared/services/base.service";
import { PermissionsRepository } from "./permissions.repository";

import type { Permission } from "./permissions.types";

import type { CreatePermissionInput, UpdatePermissionInput } from "./permissions.schema";

export class PermissionsService extends BaseService<
    Permission,
    CreatePermissionInput,
    UpdatePermissionInput
> {
    constructor(repository: PermissionsRepository) {
        super(repository, "Permiso");
    }
}
