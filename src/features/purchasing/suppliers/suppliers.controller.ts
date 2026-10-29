import { BaseController } from "../../../shared/controllers/base.controller";
import { SuppliersService } from "./suppliers.service";

import type { Supplier } from "./suppliers.types";

import type { CreateSuppliersInput, UpdateSuppliersInput } from "./suppliers.schema";

export class SuppliersController extends BaseController<
    Supplier,
    CreateSuppliersInput,
    UpdateSuppliersInput
> {
    constructor(service: SuppliersService) {
        super(service);
    }
}
