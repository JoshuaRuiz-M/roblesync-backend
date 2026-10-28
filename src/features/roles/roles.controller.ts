import { Request, Response } from "express";
import { BaseController } from "../../shared/controllers/base.controller";
import { ApiResponder } from "../../shared/http/api-responder";
import { getValidated } from "../../shared/http/validated-request";
import { RolesService } from "./roles.service";

import type {
    Role,
    CreateRole,
    UpdateRole,
    SyncRoleMenuItems,
    SyncRolePermissions,
} from "./roles.types";

export class RolesController extends BaseController<Role, CreateRole, UpdateRole> {
    constructor(private readonly rolesService: RolesService) {
        super(rolesService);
    }

    findMenuItems = async (_req: Request, res: Response): Promise<void> => {
        const roleId = Number(this.getId(res));

        const menuItems = await this.rolesService.findMenuItems(roleId);

        ApiResponder.ok(res, menuItems);
    };

    syncMenuItems = async (_req: Request, res: Response): Promise<void> => {
        const roleId = Number(this.getId(res));

        const data = getValidated<SyncRoleMenuItems>(res, "body");

        const menuItems = await this.rolesService.syncMenuItems(roleId, data);

        ApiResponder.ok(res, menuItems, "Opciones de menú asignadas correctamente.");
    };

    findPermissions = async (_req: Request, res: Response): Promise<void> => {
        const roleId = Number(this.getId(res));

        const permissions = await this.rolesService.findPermissions(roleId);

        ApiResponder.ok(res, permissions);
    };

    syncPermissions = async (_req: Request, res: Response): Promise<void> => {
        const roleId = Number(this.getId(res));

        const data = getValidated<SyncRolePermissions>(res, "body");

        const permissions = await this.rolesService.syncPermissions(roleId, data);

        ApiResponder.ok(res, permissions, "Permisos del rol actualizados correctamente.");
    };
}
