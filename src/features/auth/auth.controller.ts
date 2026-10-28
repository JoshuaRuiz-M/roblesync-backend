import type { Request, Response } from "express";

import { AuthService } from "./auth.service";
import { ApiResponder } from "../../shared/http/api-responder";
import { getValidated } from "../../shared/http/validated-request";

import type { ChangePasswordInput, LoginInput } from "./auth.schema";
import type { AuthUser } from "./auth.types";

export class AuthController {
    constructor(private readonly service: AuthService) {}

    login = async (_req: Request, res: Response): Promise<void> => {
        const credentials = getValidated<LoginInput>(res, "body");

        const result = await this.service.login(credentials);

        res.setHeader("Cache-Control", "no-store");

        ApiResponder.ok(res, result, "Inicio de sesión exitoso.");
    };

    me = async (_req: Request, res: Response): Promise<void> => {
        const user = res.locals.authUser as AuthUser;

        const profile = await this.service.getProfile(user.username);

        res.setHeader("Cache-Control", "no-store");

        ApiResponder.ok(res, profile);
    };

    getMenu = async (_req: Request, res: Response): Promise<void> => {
        const authUser = res.locals.authUser as AuthUser;

        const menuItems = await this.service.getMenu(authUser.username);

        res.setHeader("Cache-Control", "no-store");

        ApiResponder.ok(res, menuItems);
    };

    changePassword = async (_req: Request, res: Response): Promise<void> => {
        const authUser = res.locals.authUser as AuthUser;
        const data = getValidated<ChangePasswordInput>(res, "body");

        await this.service.changePassword(authUser.username, data);

        res.setHeader("Cache-Control", "no-store");

        ApiResponder.ok(res, null, "Contraseña actualizada correctamente.");
    };
}
