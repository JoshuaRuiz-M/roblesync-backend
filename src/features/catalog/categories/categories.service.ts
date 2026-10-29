import { BaseService } from "../../../shared/services/base.service";
import { CategoriesRepository } from "./categories.repository";

import type { Category } from "./categories.types";

import type { CreateCategoriesInput, UpdateCategoriesInput } from "./categories.schema";

export class CategoriesService extends BaseService<
    Category,
    CreateCategoriesInput,
    UpdateCategoriesInput
> {
    constructor(repository: CategoriesRepository) {
        super(repository, "Categoría");
    }
}
