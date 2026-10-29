import { BaseService } from "../../shared/services/base.service";
import { BrandsRepository } from "./brands.repository";

import type { Brand } from "./brands.types";

import type { CreateBrandsInput, UpdateBrandsInput } from "./brands.schema";

export class BrandsService extends BaseService<Brand, CreateBrandsInput, UpdateBrandsInput> {
    constructor(repository: BrandsRepository) {
        super(repository, "Marca");
    }
}
