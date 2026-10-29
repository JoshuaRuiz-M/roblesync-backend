import { BaseService } from "../../../shared/services/base.service";
import { WarehousesRepository } from "./warehouses.repository";

import type { Warehouse } from "./warehouses.types";

import type { CreateWarehousesInput, UpdateWarehousesInput } from "./warehouses.schema";

export class WarehousesService extends BaseService<
    Warehouse,
    CreateWarehousesInput,
    UpdateWarehousesInput
> {
    constructor(repository: WarehousesRepository) {
        super(repository, "Almacén");
    }
}
