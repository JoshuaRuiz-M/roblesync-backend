import { BaseController } from "../../../shared/controllers/base.controller";

import { InventoryMovementsService } from "./inventory-movements.service";

import type { InventoryMovement } from "./inventory-movements.types";

import type {
    CreateInventoryMovementsInput,
    UpdateInventoryMovementsInput,
} from "./inventory-movements.schema";

export class InventoryMovementsController extends BaseController<
    InventoryMovement,
    CreateInventoryMovementsInput,
    UpdateInventoryMovementsInput
> {
    constructor(service: InventoryMovementsService) {
        super(service);
    }
}
