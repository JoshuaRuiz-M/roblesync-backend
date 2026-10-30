import { BaseController } from "../../../shared/controllers/base.controller";
import { SalespersonsService } from "./salespersons.service";

import type { Saleperson } from "./salespersons.types";

import type { CreateSalespersonsInput, UpdateSalespersonsInput } from "./salespersons.schema";

export class SalespersonsController extends BaseController<
    Saleperson,
    CreateSalespersonsInput,
    UpdateSalespersonsInput
> {
    constructor(service: SalespersonsService) {
        super(service);
    }
}
