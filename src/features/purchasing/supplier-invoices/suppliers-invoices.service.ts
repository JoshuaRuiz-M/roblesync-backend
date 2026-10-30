import { BaseService } from "../../../shared/services/base.service";
import { SupplierInvoicesRepository } from "./suppliers-invoices.repository";
import {
    CreateSupplierInvoicesInput,
    UpdateSupplierInvoicesInput,
} from "./suppliers-invoices.schema";

import type { SupplierInvoice } from "./suppliers-invoices.types";

export class SupplierInvoicesService extends BaseService<
    SupplierInvoice,
    CreateSupplierInvoicesInput,
    UpdateSupplierInvoicesInput
> {
    constructor(repository: SupplierInvoicesRepository) {
        super(repository, "Factura de proveedor");
    }
}
