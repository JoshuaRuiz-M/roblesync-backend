import { BaseController } from "../../../shared/controllers/base.controller";
import {
    CreateSupplierInvoicesInput,
    UpdateSupplierInvoicesInput,
} from "./suppliers-invoices.schema";
import { SupplierInvoicesService } from "./suppliers-invoices.service";
import { SupplierInvoice } from "./suppliers-invoices.types";

export class SupplierInvoicesController extends BaseController<
    SupplierInvoice,
    CreateSupplierInvoicesInput,
    UpdateSupplierInvoicesInput
> {
    constructor(service: SupplierInvoicesService) {
        super(service);
    }
}
