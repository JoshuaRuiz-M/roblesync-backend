import { BaseService } from "../../../shared/services/base.service";
import { SalespersonsRepository } from "./salespersons.repository";

import type { Saleperson } from "./salespersons.types";
import { CreateSalespersonsInput, UpdateSalespersonsInput } from "./salespersons.schema";

export class SalespersonsService extends BaseService<
    Saleperson,
    CreateSalespersonsInput,
    UpdateSalespersonsInput
> {
    constructor(repository: SalespersonsRepository) {
        super(repository, "Vendedor");
    }
}
