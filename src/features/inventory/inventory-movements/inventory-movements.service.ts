import { BaseService } from "../../../shared/services/base.service";
import { InventoryMovementsRepository } from "./inventory-movements.repository";

import type { InventoryMovement } from "./inventory-movements.types";

import type {
    CreateInventoryMovementsInput,
    UpdateInventoryMovementsInput,
} from "./inventory-movements.schema";

export class InventoryMovementsService extends BaseService<
    InventoryMovement,
    CreateInventoryMovementsInput,
    UpdateInventoryMovementsInput
> {
    constructor(repository: InventoryMovementsRepository) {
        super(repository, "Movimiento de Inventario");
    }
}
