import type { z } from "zod";

export type RepositoryId = number | string;

export interface RepositoryConfig<
    TEntity extends object,
    TCreate extends object,
    TUpdate extends object,
> {
    schema: string;
    table: string;

    primaryKey: Extract<keyof TEntity, string>;

    columns: readonly Extract<keyof TEntity, string>[];

    schemas: {
        create: z.ZodType<TCreate>;
        update: z.ZodType<TUpdate>;
    };

    hasAuditFields?: boolean;
    hasUserFields?: boolean;
}
