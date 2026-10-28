import { rateLimit } from "express-rate-limit";

import { env } from "./env";
import { HttpStatus } from "../shared/constants/http-status";
import { AppError } from "../shared/errors/app-error";
import type { Request, Response, NextFunction } from "express";

const rateLimitHandler = (_req: Request, _res: Response, next: NextFunction) => {
    next(
        new AppError(
            HttpStatus.TOO_MANY_REQUESTS,
            "Has realizado demasiadas solicitudes. Inténtalo nuevamente más tarde.",
        ),
    );
};

export const globalRateLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    limit: env.RATE_LIMIT_MAX,

    standardHeaders: "draft-7",
    legacyHeaders: false,

    handler: rateLimitHandler,
});

export const strictRateLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_STRICT_WINDOW_MS,
    limit: env.RATE_LIMIT_STRICT_MAX,

    standardHeaders: "draft-7",
    legacyHeaders: false,

    handler: rateLimitHandler,
});
