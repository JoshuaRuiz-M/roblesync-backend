import { BaseRepository } from "../../../shared/repositories/base.repository";

import { createSalespersonsSchema, updateSalespersonsSchema } from "./salespersons.schema";

import type { Saleperson } from "./salespersons.types";

import type { CreateSalespersonsInput, UpdateSalespersonsInput } from "./salespersons.schema";

export class SalespersonsRepository extends BaseRepository<
    Saleperson,
    CreateSalespersonsInput,
    UpdateSalespersonsInput
> {
    constructor() {
        super({
            schema: "sales",
            table: "salespersons",
            primaryKey: "salesperson_id",
            columns: [
                "salesperson_id",
                "user_id",
                "employee_code",
                "phone",
                "is_active",
                "created_at",
                "updated_at",
                "created_by",
                "updated_by",
            ],
            hasAuditFields: true,
            hasUserFields: true,
            schemas: {
                create: createSalespersonsSchema,
                update: updateSalespersonsSchema,
            },
        });
    }
}
