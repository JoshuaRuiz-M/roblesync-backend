import { BaseRepository } from "../../../shared/repositories/base.repository";

import { createproductBatchesSchema, updateproductBatchesSchema } from "./product-batches.schema";

import type { ProductBatch } from "./product-batches.types";

import type {
    CreateproductBatchesInput,
    UpdateproductBatchesInput,
} from "./product-batches.schema";

export class ProductBatchesRepository extends BaseRepository<
    ProductBatch,
    CreateproductBatchesInput,
    UpdateproductBatchesInput
> {
    constructor() {
        super({
            schema: "inventory",
            table: "product_batches",
            primaryKey: "batch_id",
            columns: [
                "batch_id",
                "product_id",
                "batch_number",
                "manufacturing_date",
                "expiration_date",
                "received_at",
                "is_active",
                "created_at",
                "created_by",
                "updated_at",
                "updated_by",
            ],
            hasAuditFields: true,
            hasUserFields: true,
            schemas: {
                create: createproductBatchesSchema,
                update: updateproductBatchesSchema,
            },
        });
    }
}
