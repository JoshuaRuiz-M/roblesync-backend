import { BaseRepository } from "../../../shared/repositories/base.repository";

import {
    createInventoryMovementsSchema,
    updateInventoryMovementsSchema,
} from "./inventory-movements.schema";

import type { InventoryMovement } from "./inventory-movements.types";

import type {
    CreateInventoryMovementsInput,
    UpdateInventoryMovementsInput,
} from "./inventory-movements.schema";

export class InventoryMovementsRepository extends BaseRepository<
    InventoryMovement,
    CreateInventoryMovementsInput,
    UpdateInventoryMovementsInput
> {
    constructor() {
        super({
            schema: "inventory",
            table: "inventory_movements",
            primaryKey: "inventory_movement_id",
            columns: [
                "inventory_movement_id",
                "warehouse_id",
                "product_id",
                "batch_id",
                "movement_type",
                "movement_date",
                "quantity",
                "unit_cost",
                "total_cost",
                "balance_quantity",
                "balance_value",
                "reference_type",
                "reference_id",
                "notes",
                "created_at",
                "created_by",
            ],
            hasAuditFields: true,
            hasUserFields: true,
            schemas: {
                create: createInventoryMovementsSchema,
                update: updateInventoryMovementsSchema,
            },
        });
    }
}
