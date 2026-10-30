import { BaseRepository } from "../../../shared/repositories/base.repository";

import { createCustomersSchema, updateCustomersSchema } from "./customers.schema";

import type { Customer } from "./customers.types";

import type { CreateCustomersInput, UpdateCustomersInput } from "./customers.schema";

export class CustomersRepository extends BaseRepository<
    Customer,
    CreateCustomersInput,
    UpdateCustomersInput
> {
    constructor() {
        super({
            schema: "sales",
            table: "customers",
            primaryKey: "customer_id",
            columns: [
                "customer_id",
                "customer_code",
                "tax_id",
                "business_name",
                "customer_type",
                "contact_name",
                "phone",
                "email",
                "address",
                "salesperson_id",
                "price_list_id",
                "credit_days",
                "credit_limit",
                "is_credit_blocked",
                "is_active",
                "created_at",
                "created_by",
                "updated_at",
                "updated_by",
            ],
            hasAuditFields: true,
            hasUserFields: true,
            schemas: {
                create: createCustomersSchema,
                update: updateCustomersSchema,
            },
        });
    }
}
