import { BaseController } from "../../../shared/controllers/base.controller";
import { ProductBatchesService } from "./product-batches.service";

import type { ProductBatch } from "./product-batches.types";

import type {
    CreateproductBatchesInput,
    UpdateproductBatchesInput,
} from "./product-batches.schema";

export class ProductBatchesController extends BaseController<
    ProductBatch,
    CreateproductBatchesInput,
    UpdateproductBatchesInput
> {
    constructor(service: ProductBatchesService) {
        super(service);
    }
}
