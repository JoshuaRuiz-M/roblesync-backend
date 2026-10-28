import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app-error";
import { HttpStatus } from "../constants/http-status";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
    const requestId = res.locals.requestId as string;

    if (err instanceof ZodError) {
        res.status(HttpStatus.BAD_REQUEST)
            .type("application/problem+json")
            .json({
                requestId,
                type: "about:blank",
                title: "Bad Request",
                status: HttpStatus.BAD_REQUEST,
                detail: "Los datos proporcionados no son válidos.",
                instance: req.originalUrl,
                errors: err.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            });

        return;
    }

    if (err instanceof AppError) {
        res.status(err.statusCode)
            .type("application/problem+json")
            .json({
                requestId,
                type: err.type,
                title: getHttpTitle(err.statusCode),
                status: err.statusCode,
                detail: err.message,
                instance: req.originalUrl,
            });

        return;
    }

    req.log.error({ err }, "Error inesperado en la aplicación");

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).type("application/problem+json").json({
        requestId,
        type: "about:blank",
        title: "Internal Server Error",
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        detail: "Ocurrió un error interno en el servidor.",
        instance: req.originalUrl,
    });
};

const getHttpTitle = (status: HttpStatus): string => {
    const titles: Record<number, string> = {
        [HttpStatus.BAD_REQUEST]: "Bad Request",
        [HttpStatus.UNAUTHORIZED]: "Unauthorized",
        [HttpStatus.FORBIDDEN]: "Forbidden",
        [HttpStatus.NOT_FOUND]: "Not Found",
        [HttpStatus.CONFLICT]: "Conflict",
        [HttpStatus.UNPROCESSABLE_CONTENT]: "Unprocessable Content",
        [HttpStatus.INTERNAL_SERVER_ERROR]: "Internal Server Error",
    };

    return titles[status] ?? "Error";
};
