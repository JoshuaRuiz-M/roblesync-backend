import { BaseService } from "../../../shared/services/base.service";
import { ProductBatchesRepository } from "./product-batches.repository";

import type { ProductBatch } from "./product-batches.types";

import type {
    CreateproductBatchesInput,
    UpdateproductBatchesInput,
} from "./product-batches.schema";

export class ProductBatchesService extends BaseService<
    ProductBatch,
    CreateproductBatchesInput,
    UpdateproductBatchesInput
> {
    constructor(repository: ProductBatchesRepository) {
        super(repository, "Línea de Producto");
    }
}
