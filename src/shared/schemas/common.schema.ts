import { z } from "zod";

export const paginationSchema = z.strictObject({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const numericIdSchema = z.strictObject({
    id: z.coerce.number().int().positive().safe(),
});

export const stringIdSchema = z.strictObject({
    id: z.string().trim().min(1),
});

export type PaginationQuery = z.output<typeof paginationSchema>;
