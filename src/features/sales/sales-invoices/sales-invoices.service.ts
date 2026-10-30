import { BaseService } from "../../../shared/services/base.service";
import { SalesInvoicesRepository } from "./sales-invoices.repository";
import { cancelSalesInvoiceSchema } from "./sales-invoices.schema";

import type {
    SalesInvoice,
    SalesInvoiceDetail,
    CreateSalesInvoice,
    UpdateSalesInvoice,
    CancelSalesInvoice,
} from "./sales-invoices.types";

export class SalesInvoicesService extends BaseService<
    SalesInvoice,
    CreateSalesInvoice,
    UpdateSalesInvoice
> {
    constructor(private readonly salesInvoicesRepository: SalesInvoicesRepository) {
        super(salesInvoicesRepository, "Factura de venta");
    }

    async findDetails(salesInvoiceId: number): Promise<SalesInvoiceDetail[]> {
        await this.findById(salesInvoiceId);

        return this.salesInvoicesRepository.findDetails(salesInvoiceId);
    }

    async cancel(
        salesInvoiceId: number,
        data: CancelSalesInvoice,
        userId: number,
    ): Promise<SalesInvoice> {
        const validated = cancelSalesInvoiceSchema.parse(data);

        await this.findById(salesInvoiceId);

        return this.salesInvoicesRepository.cancel(
            salesInvoiceId,
            validated.cancellation_reason,
            userId,
        );
    }
}
