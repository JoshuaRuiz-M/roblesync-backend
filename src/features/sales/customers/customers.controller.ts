import { BaseController } from "../../../shared/controllers/base.controller";
import { CustomersService } from "./customers.service";

import type { Customer } from "./customers.types";

import type { CreateCustomersInput, UpdateCustomersInput } from "./customers.schema";

export class CustomersController extends BaseController<
    Customer,
    CreateCustomersInput,
    UpdateCustomersInput
> {
    constructor(customersService: CustomersService) {
        super(customersService);
    }
}
