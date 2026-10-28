import type { RequestHandler } from "express";

import { AuthRepository } from "../../features/auth/auth.repository";
import { AppError } from "../errors/app-error";
import { HttpStatus } from "../constants/http-status";

import type { AuthUser } from "../../features/auth/auth.types";

const repository = new AuthRepository();

export const authorize = (permission: string): RequestHandler => {
    return async (_req, res, next) => {
        const user = res.locals.authUser as AuthUser | undefined;

        if (!user) {
            throw new AppError(HttpStatus.UNAUTHORIZED, "Se requiere autenticación.");
        }

        const permissions = await repository.findPermissionCodes(user.user_id);

        if (!permissions.includes(permission)) {
            throw new AppError(
                HttpStatus.FORBIDDEN,
                "No tiene permiso para realizar esta operación.",
            );
        }

        next();
    };
};
