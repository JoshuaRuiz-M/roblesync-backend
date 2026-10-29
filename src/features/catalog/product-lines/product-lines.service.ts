import { BaseService } from "../../../shared/services/base.service";
import { ProductLinesRepository } from "./product-lines.repository";

import type { ProductLine } from "./product-lines.types";

import type { CreateproductLinesInput, UpdateproductLinesInput } from "./product-lines.schema";

export class ProductLinesService extends BaseService<
    ProductLine,
    CreateproductLinesInput,
    UpdateproductLinesInput
> {
    constructor(repository: ProductLinesRepository) {
        super(repository, "Línea de Producto");
    }
}
