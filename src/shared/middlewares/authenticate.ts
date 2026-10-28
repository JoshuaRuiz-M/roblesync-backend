import type { RequestHandler } from "express";
import { errors } from "jose";

import { Jwt } from "../security/jwt";
import { AppError } from "../errors/app-error";
import { HttpStatus } from "../constants/http-status";
import { AuthRepository } from "../../features/auth/auth.repository";

const repository = new AuthRepository();

export const authenticate: RequestHandler = async (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        throw new AppError(HttpStatus.UNAUTHORIZED, "Se requiere autenticación.");
    }

    const match = /^Bearer ([^\s]+)$/.exec(authorization);

    if (!match) {
        throw new AppError(HttpStatus.UNAUTHORIZED, "El encabezado de autenticación es inválido.");
    }

    let payload;

    try {
        payload = await Jwt.verify(match[1]);
    } catch (error) {
        if (
            error instanceof errors.JOSEError ||
            (error instanceof Error && error.message === "El token contiene información inválida.")
        ) {
            throw new AppError(
                HttpStatus.UNAUTHORIZED,
                "Token de autenticación inválido o expirado.",
            );
        }

        throw error;
    }

    const user = await repository.findActiveByUsername(payload.username);

    if (!user || user.email !== payload.email) {
        throw new AppError(HttpStatus.UNAUTHORIZED, "Token de autenticación inválido o expirado.");
    }

    res.locals.authUser = user;

    next();
};
