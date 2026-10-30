import { BaseRepository } from "../../../shared/repositories/base.repository";
import {
    CreateSupplierInvoicesInput,
    createSupplierInvoicesSchema,
    UpdateSupplierInvoicesInput,
    updateSupplierInvoicesSchema,
} from "./suppliers-invoices.schema";

import type { SupplierInvoice } from "./suppliers-invoices.types";

export class SupplierInvoicesRepository extends BaseRepository<
    SupplierInvoice,
    CreateSupplierInvoicesInput,
    UpdateSupplierInvoicesInput
> {
    constructor() {
        super({
            schema: "purchasing",
            table: "supplier_invoices",
            primaryKey: "supplier_invoice_id",
            columns: [
                "supplier_invoice_id",
                "supplier_id",
                "purchase_order_id",
                "invoice_number",
                "invoice_date",
                "due_date",
                "subtotal",
                "tax_amount",
                "total_amount",
                "status",
                "notes",
                "created_at",
                "created_by",
                "updated_at",
                "updated_by",
            ],
            hasAuditFields: true,
            hasUserFields: true,
            schemas: {
                create: createSupplierInvoicesSchema,
                update: updateSupplierInvoicesSchema,
            },
        });
    }
}
