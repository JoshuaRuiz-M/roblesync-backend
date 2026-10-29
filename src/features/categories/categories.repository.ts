import { BaseRepository } from "../../shared/repositories/base.repository";

import { createCategoriesSchema, updateCategoriesSchema } from "./categories.schema";

import type { Category } from "./categories.types";

import type { CreateCategoriesInput, UpdateCategoriesInput } from "./categories.schema";

export class CategoriesRepository extends BaseRepository<
    Category,
    CreateCategoriesInput,
    UpdateCategoriesInput
> {
    constructor() {
        super({
            schema: "catalog",
            table: "categories",
            primaryKey: "category_id",
            columns: [
                "category_id",
                "code",
                "name",
                "description",
                "is_active",
                "created_at",
                "updated_at",
                "created_by",
                "updated_by",
            ],
            hasAuditFields: true,
            hasUserFields: true,
            schemas: {
                create: createCategoriesSchema,
                update: updateCategoriesSchema,
            },
        });
    }
}
