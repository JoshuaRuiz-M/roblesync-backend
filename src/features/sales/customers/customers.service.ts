import { BaseService } from "../../../shared/services/base.service";
import { CustomersRepository } from "./customers.repository";

import type { Customer } from "./customers.types";
import { CreateCustomersInput, UpdateCustomersInput } from "./customers.schema";

export class CustomersService extends BaseService<
    Customer,
    CreateCustomersInput,
    UpdateCustomersInput
> {
    constructor(repository: CustomersRepository) {
        super(repository, "Cliente");
    }
}
