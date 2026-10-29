import { BaseRepository } from "../../../shared/repositories/base.repository";

import { createProductsSchema, updateProductsSchema } from "./products.schema";

import type { Product } from "./products.types";

import type { CreateProductsInput, UpdateProductsInput } from "./products.schema";

export class ProductsRepository extends BaseRepository<
    Product,
    CreateProductsInput,
    UpdateProductsInput
> {
    constructor() {
        super({
            schema: "catalog",
            table: "products",
            primaryKey: "product_id",
            columns: [
                "product_id",
                "brand_id",
                "product_line_id",
                "unit_of_measure_id",
                "sku",
                "barcode",
                "name",
                "description",
                "weight",
                "average_cost",
                "list_price",
                "minimum_stock",
                "maximum_stock",
                "reorder_point",
                "tracks_expiration",
                "is_active",
                "created_at",
                "created_by",
                "updated_at",
                "updated_by",
            ],
            hasAuditFields: true,
            hasUserFields: true,
            schemas: {
                create: createProductsSchema,
                update: updateProductsSchema,
            },
        });
    }
}
