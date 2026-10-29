import { BaseController } from "../../../shared/controllers/base.controller";
import { WarehousesService } from "./warehouses.service";

import type { Warehouse } from "./warehouses.types";

import type { CreateWarehousesInput, UpdateWarehousesInput } from "./warehouses.schema";

export class WarehousesController extends BaseController<
    Warehouse,
    CreateWarehousesInput,
    UpdateWarehousesInput
> {
    constructor(service: WarehousesService) {
        super(service);
    }
}
