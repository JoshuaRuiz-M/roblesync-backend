import { BaseService } from "../../../shared/services/base.service";
import { SuppliersRepository } from "./suppliers.repository";

import type { Supplier } from "./suppliers.types";

import type { CreateSuppliersInput, UpdateSuppliersInput } from "./suppliers.schema";

export class SuppliersService extends BaseService<
    Supplier,
    CreateSuppliersInput,
    UpdateSuppliersInput
> {
    constructor(repository: SuppliersRepository) {
        super(repository, "Proveedor");
    }
}
