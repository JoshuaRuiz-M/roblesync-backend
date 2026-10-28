import type { Response } from "express";

import type { ApiResponse, PaginatedResponse } from "./api-response";

import type { PaginatedResult } from "./pagination";
import { HttpStatus } from "../constants/http-status";

export class ApiResponder {
    static ok<T>(res: Response, data: T, message?: string): Response<ApiResponse<T>> {
        const body: ApiResponse<T> = {
            success: true,
            data,
            ...(message !== undefined ? { message } : {}),
        };

        return res.status(HttpStatus.OK).json(body);
    }

    static created<T>(res: Response, data: T, message?: string): Response<ApiResponse<T>> {
        const body: ApiResponse<T> = {
            success: true,
            data,
            ...(message !== undefined ? { message } : {}),
        };

        return res.status(HttpStatus.CREATED).json(body);
    }

    static paginated<T>(
        res: Response,
        result: PaginatedResult<T>,
        message?: string,
    ): Response<PaginatedResponse<T>> {
        const body: PaginatedResponse<T> = {
            success: true,
            data: result.data,
            meta: result.meta,
            ...(message !== undefined ? { message } : {}),
        };

        return res.status(HttpStatus.OK).json(body);
    }

    static noContent(res: Response): Response {
        return res.status(HttpStatus.NO_CONTENT).send();
    }
}
