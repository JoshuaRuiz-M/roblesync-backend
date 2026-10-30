import { BaseRepository } from "../../../shared/repositories/base.repository";

import { createSalesTargetsSchema, updateSalesTargetsSchema } from "./sales-targets.schema";

import type { SaleTarget } from "./sales-targets.types";

import type { CreateSalesTargetsInput, UpdateSalesTargetsInput } from "./sales-targets.schema";

export class SalespersonsRepository extends BaseRepository<
    SaleTarget,
    CreateSalesTargetsInput,
    UpdateSalesTargetsInput
> {
    constructor() {
        super({
            schema: "sales",
            table: "sales_targets ",
            primaryKey: "sales_target_id",
            columns: [
                "sales_target_id",
                "salesperson_id",
                "target_year",
                "target_month",
                "target_amount",
                "created_at",
                "updated_at",
                "created_by",
                "updated_by",
            ],
            hasAuditFields: true,
            hasUserFields: true,
            schemas: {
                create: createSalesTargetsSchema,
                update: updateSalesTargetsSchema,
            },
        });
    }
}
