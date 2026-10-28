import { HttpStatus } from "../../shared/constants/http-status";
import { AppError } from "../../shared/errors/app-error";
import { BaseService } from "../../shared/services/base.service";
import { RolesRepository } from "./roles.repository";

import type {
    Role,
    CreateRole,
    UpdateRole,
    RoleMenuItem,
    SyncRoleMenuItems,
    SyncRolePermissions,
    RolePermissionItem,
} from "./roles.types";

export class RolesService extends BaseService<Role, CreateRole, UpdateRole> {
    constructor(private readonly rolesRepository: RolesRepository) {
        super(rolesRepository, "Rol");
    }

    async findMenuItems(roleId: number): Promise<RoleMenuItem[]> {
        await this.findById(roleId);

        return this.rolesRepository.findMenuItems(roleId);
    }

    async syncMenuItems(roleId: number, data: SyncRoleMenuItems): Promise<RoleMenuItem[]> {
        await this.findById(roleId);

        const total = await this.rolesRepository.countExistingMenuItems(data.menu_item_ids);

        if (total !== data.menu_item_ids.length) {
            throw new AppError(HttpStatus.BAD_REQUEST, "Una o más opciones de menú no existen.");
        }

        await this.rolesRepository.syncMenuItems(roleId, data.menu_item_ids);

        return this.rolesRepository.findMenuItems(roleId);
    }

    async findPermissions(roleId: number): Promise<RolePermissionItem[]> {
        await this.findById(roleId);

        return this.rolesRepository.findPermissions(roleId);
    }

    async syncPermissions(
        roleId: number,
        data: SyncRolePermissions,
    ): Promise<RolePermissionItem[]> {
        await this.findById(roleId);

        const existingPermissions = await this.rolesRepository.countExistingPermissions(
            data.permission_ids,
        );

        if (existingPermissions !== data.permission_ids.length) {
            throw new AppError(HttpStatus.BAD_REQUEST, "Uno o más permisos no existen.");
        }

        await this.rolesRepository.syncPermissions(roleId, data.permission_ids);

        return this.rolesRepository.findPermissions(roleId);
    }
}
