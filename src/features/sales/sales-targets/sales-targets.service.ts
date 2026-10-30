import { BaseService } from "../../../shared/services/base.service";
import { SalespersonsRepository } from "./sales-targets.repository";

import type { SaleTarget } from "./sales-targets.types";
import { CreateSalesTargetsInput, UpdateSalesTargetsInput } from "./sales-targets.schema";

export class SalesTargetsService extends BaseService<
    SaleTarget,
    CreateSalesTargetsInput,
    UpdateSalesTargetsInput
> {
    constructor(repository: SalespersonsRepository) {
        super(repository, "Objetivo de ventas");
    }
}
