import { randomUUID } from "node:crypto";
import { RequestHandler } from "express";

export const requestId: RequestHandler = (req, res, next) => {
    const id = randomUUID();

    res.locals.requestId = id;

    res.setHeader("X-Request-ID", id);

    next();
};
