import { BaseService } from "../../../shared/services/base.service";
import { UnitsOfMeasureRepository } from "./units-of-measure.repository";

import type { UnitOfMeasure } from "./units-of-measure.types";

import type {
    CreateUnitsOfMeasureInput,
    UpdateUnitsOfMeasureInput,
} from "./units-of-measure.schema";

export class UnitsOfMeasureService extends BaseService<
    UnitOfMeasure,
    CreateUnitsOfMeasureInput,
    UpdateUnitsOfMeasureInput
> {
    constructor(repository: UnitsOfMeasureRepository) {
        super(repository, "Unidad de Medida");
    }
}
