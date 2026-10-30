import { BaseController } from "../../../shared/controllers/base.controller";
import { SalesTargetsService } from "./sales-targets.service";

import type { SaleTarget } from "./sales-targets.types";
import { CreateSalesTargetsInput, UpdateSalesTargetsInput } from "./sales-targets.schema";

export class SalesTargetsController extends BaseController<
    SaleTarget,
    CreateSalesTargetsInput,
    UpdateSalesTargetsInput
> {
    constructor(service: SalesTargetsService) {
        super(service);
    }
}
