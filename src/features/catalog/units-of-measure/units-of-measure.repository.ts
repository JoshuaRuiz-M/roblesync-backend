import { BaseRepository } from "../../../shared/repositories/base.repository";

import { createUnitsOfMeasureSchema, updateUnitsOfMeasureSchema } from "./units-of-measure.schema";

import type { UnitOfMeasure } from "./units-of-measure.types";

import type {
    CreateUnitsOfMeasureInput,
    UpdateUnitsOfMeasureInput,
} from "./units-of-measure.schema";

export class UnitsOfMeasureRepository extends BaseRepository<
    UnitOfMeasure,
    CreateUnitsOfMeasureInput,
    UpdateUnitsOfMeasureInput
> {
    constructor() {
        super({
            schema: "catalog",
            table: "units_of_measure",
            primaryKey: "unit_of_measure_id",
            columns: [
                "unit_of_measure_id",
                "code",
                "name",
                "abbreviation",
                "description",
                "is_active",
                "created_at",
                "created_by",
                "updated_at",
                "updated_by",
            ],
            hasAuditFields: true,
            hasUserFields: true,
            schemas: {
                create: createUnitsOfMeasureSchema,
                update: updateUnitsOfMeasureSchema,
            },
        });
    }
}
