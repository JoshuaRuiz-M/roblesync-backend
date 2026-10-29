import { BaseRepository } from "../../../shared/repositories/base.repository";

import { createSuppliersSchema, updateSuppliersSchema } from "./suppliers.schema";

import type { Supplier } from "./suppliers.types";

import type { CreateSuppliersInput, UpdateSuppliersInput } from "./suppliers.schema";

export class SuppliersRepository extends BaseRepository<
    Supplier,
    CreateSuppliersInput,
    UpdateSuppliersInput
> {
    constructor() {
        super({
            schema: "purchasing",
            table: "suppliers",
            primaryKey: "supplier_id",
            columns: [
                "supplier_id",
                "tax_id",
                "business_name",
                "contact_name",
                "phone",
                "email",
                "address",
                "credit_days",
                "credit_limit",
                "is_active",
                "created_at",
                "created_by",
                "updated_at",
                "updated_by",
            ],
            hasAuditFields: true,
            hasUserFields: true,
            schemas: {
                create: createSuppliersSchema,
                update: updateSuppliersSchema,
            },
        });
    }
}
