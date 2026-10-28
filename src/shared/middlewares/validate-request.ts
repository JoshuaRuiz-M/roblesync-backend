import type { RequestHandler } from "express";
import { z } from "zod";

export type RequestSchema = {
    body?: z.ZodType;
    params?: z.ZodType;
    query?: z.ZodType;
};

export type ValidatedRequest = {
    body?: unknown;
    params?: unknown;
    query?: unknown;
};

export const validateRequest = (schema: RequestSchema): RequestHandler => {
    return (req, res, next) => {
        try {
            const validated: ValidatedRequest = {};

            if (schema.body) {
                validated.body = schema.body.parse(req.body);
            }

            if (schema.params) {
                validated.params = schema.params.parse(req.params);
            }

            if (schema.query) {
                validated.query = schema.query.parse(req.query);
            }

            res.locals.validated = validated;

            next();
        } catch (error) {
            next(error);
        }
    };
};
