import { BaseController } from "../../../shared/controllers/base.controller";
import { BrandsService } from "./brands.service";

import type { Brand } from "./brands.types";

import type { CreateBrandsInput, UpdateBrandsInput } from "./brands.schema";

export class BrandsController extends BaseController<Brand, CreateBrandsInput, UpdateBrandsInput> {
    constructor(service: BrandsService) {
        super(service);
    }
}
