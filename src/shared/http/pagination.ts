export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginationMeta extends PaginationParams {
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
    data: T[];
    meta: PaginationMeta;
}

export const PAGINATION_DEFAULTS = {
    PAGE: 1,
    LIMIT: 10,
    MAX_LIMIT: 100,
} as const;

export function createPaginationMeta(params: PaginationParams, total: number): PaginationMeta {
    const totalPages = Math.ceil(total / params.limit);

    return {
        page: params.page,
        limit: params.limit,
        total,
        totalPages,
        hasNextPage: params.page < totalPages,
        hasPreviousPage: params.page > 1,
    };
}
