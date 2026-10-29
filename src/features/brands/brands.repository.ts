import { BaseRepository } from "../../shared/repositories/base.repository";

import { createBrandsSchema, updateBrandsSchema } from "./brands.schema";

import type { Brand } from "./brands.types";

import type { CreateBrandsInput, UpdateBrandsInput } from "./brands.schema";

export class BrandsRepository extends BaseRepository<Brand, CreateBrandsInput, UpdateBrandsInput> {
    constructor() {
        super({
            schema: "catalog",
            table: "brands",
            primaryKey: "brand_id",
            columns: [
                "brand_id",
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
                create: createBrandsSchema,
                update: updateBrandsSchema,
            },
        });
    }
}
