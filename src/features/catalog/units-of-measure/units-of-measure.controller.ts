import { BaseController } from "../../../shared/controllers/base.controller";
import { UnitsOfMeasureService } from "./units-of-measure.service";

import type { UnitOfMeasure } from "./units-of-measure.types";

import type {
    CreateUnitsOfMeasureInput,
    UpdateUnitsOfMeasureInput,
} from "./units-of-measure.schema";

export class UnitsOfMeasureController extends BaseController<
    UnitOfMeasure,
    CreateUnitsOfMeasureInput,
    UpdateUnitsOfMeasureInput
> {
    constructor(service: UnitsOfMeasureService) {
        super(service);
    }
}
