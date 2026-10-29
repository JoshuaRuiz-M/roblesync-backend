import { BaseRepository } from "../../../shared/repositories/base.repository";

import { createproductLinesSchema, updateproductLinesSchema } from "./product-lines.schema";

import type { ProductLine } from "./product-lines.types";

import type { CreateproductLinesInput, UpdateproductLinesInput } from "./product-lines.schema";

export class ProductLinesRepository extends BaseRepository<
    ProductLine,
    CreateproductLinesInput,
    UpdateproductLinesInput
> {
    constructor() {
        super({
            schema: "catalog",
            table: "product_lines",
            primaryKey: "product_line_id",
            columns: [
                "product_line_id",
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
                create: createproductLinesSchema,
                update: updateproductLinesSchema,
            },
        });
    }
}
