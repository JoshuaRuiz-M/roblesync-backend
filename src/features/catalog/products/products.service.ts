import { BaseService } from "../../../shared/services/base.service";
import { ProductsRepository } from "./products.repository";

import type { Product } from "./products.types";

import type { CreateProductsInput, UpdateProductsInput } from "./products.schema";

export class ProductsService extends BaseService<
    Product,
    CreateProductsInput,
    UpdateProductsInput
> {
    constructor(repository: ProductsRepository) {
        super(repository, "Producto");
    }
}
