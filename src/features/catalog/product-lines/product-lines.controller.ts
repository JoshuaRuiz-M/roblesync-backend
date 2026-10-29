import { BaseController } from "../../../shared/controllers/base.controller";
import { ProductLinesService } from "./product-lines.service";

import type { ProductLine } from "./product-lines.types";

import type { CreateproductLinesInput, UpdateproductLinesInput } from "./product-lines.schema";

export class ProductLinesController extends BaseController<
    ProductLine,
    CreateproductLinesInput,
    UpdateproductLinesInput
> {
    constructor(service: ProductLinesService) {
        super(service);
    }
}
