import { BaseRepository } from "../../../shared/repositories/base.repository";

import { createWarehousesSchema, updateWarehousesSchema } from "./warehouses.schema";

import type { Warehouse } from "./warehouses.types";

import type { CreateWarehousesInput, UpdateWarehousesInput } from "./warehouses.schema";

export class WarehousesRepository extends BaseRepository<
    Warehouse,
    CreateWarehousesInput,
    UpdateWarehousesInput
> {
    constructor() {
        super({
            schema: "inventory",
            table: "warehouses",
            primaryKey: "warehouse_id",
            columns: [
                "warehouse_id",
                "code",
                "name",
                "description",
                "address",
                "is_active",
                "created_at",
                "updated_at",
                "created_by",
                "updated_by",
            ],
            hasAuditFields: true,
            hasUserFields: true,
            schemas: {
                create: createWarehousesSchema,
                update: updateWarehousesSchema,
            },
        });
    }
}
