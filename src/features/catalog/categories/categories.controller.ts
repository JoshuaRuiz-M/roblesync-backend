import { BaseController } from "../../../shared/controllers/base.controller";
import { CategoriesService } from "./categories.service";

import type { Category } from "./categories.types";

import type { CreateCategoriesInput, UpdateCategoriesInput } from "./categories.schema";

export class CategoriesController extends BaseController<
    Category,
    CreateCategoriesInput,
    UpdateCategoriesInput
> {
    constructor(service: CategoriesService) {
        super(service);
    }
}
