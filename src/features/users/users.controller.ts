import type { Request, Response } from "express";

import { BaseController } from "../../shared/controllers/base.controller";
import { ApiResponder } from "../../shared/http/api-responder";
import { getValidated } from "../../shared/http/validated-request";

import { UsersService } from "./users.service";

import type { User, CreateUser, UpdateUser, SyncUserRoles } from "./users.types";

export class UsersController extends BaseController<User, CreateUser, UpdateUser> {
    constructor(private readonly usersService: UsersService) {
        super(usersService);
    }

    findRoles = async (_req: Request, res: Response): Promise<void> => {
        const userId = Number(this.getId(res));

        const roles = await this.usersService.findRoles(userId);

        ApiResponder.ok(res, roles);
    };

    syncRoles = async (_req: Request, res: Response): Promise<void> => {
        const userId = Number(this.getId(res));

        const data = getValidated<SyncUserRoles>(res, "body");

        const roles = await this.usersService.syncRoles(userId, data);

        ApiResponder.ok(res, roles, "Roles del usuario actualizados correctamente.");
    };

    findMenuItems = async (_req: Request, res: Response): Promise<void> => {
        const userId = Number(this.getId(res));

        const menuItems = await this.usersService.findMenuItems(userId);

        ApiResponder.ok(res, menuItems);
    };
}
