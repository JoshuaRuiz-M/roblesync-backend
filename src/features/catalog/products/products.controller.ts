import { BaseController } from "../../../shared/controllers/base.controller";
import { ProductsService } from "./products.service";

import type { Product } from "./products.types";

import type { CreateProductsInput, UpdateProductsInput } from "./products.schema";

export class ProductsController extends BaseController<
    Product,
    CreateProductsInput,
    UpdateProductsInput
> {
    constructor(service: ProductsService) {
        super(service);
    }
}
