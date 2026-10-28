import { BaseRepository } from "../../shared/repositories/base.repository";

import { createPermissionSchema, updatePermissionSchema } from "./permissions.schema";

import type { Permission } from "./permissions.types";

import type { CreatePermissionInput, UpdatePermissionInput } from "./permissions.schema";

export class PermissionsRepository extends BaseRepository<
    Permission,
    CreatePermissionInput,
    UpdatePermissionInput
> {
    constructor() {
        super({
            schema: "security",
            table: "permissions",
            primaryKey: "permission_id",
            columns: [
                "permission_id",
                "code",
                "name",
                "description",
                "is_active",
                "created_at",
                "updated_at",
            ],
            hasAuditFields: true,
            schemas: {
                create: createPermissionSchema,
                update: updatePermissionSchema,
            },
        });
    }
}
