import type { Response } from "express";

import type { ValidatedRequest } from "../middlewares/validate-request";

export function getValidated<T>(res: Response, source: keyof ValidatedRequest): T {
    const validated = res.locals.validated as ValidatedRequest | undefined;

    if (!validated || !Object.prototype.hasOwnProperty.call(validated, source)) {
        throw new Error(`No se encontraron datos validados para: ${source}.`);
    }

    return validated[source] as T;
}
