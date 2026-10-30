import type { Request, Response } from "express";

import { BaseController } from "../../../shared/controllers/base.controller";

import { SalesInvoicesService } from "./sales-invoices.service";

import type {
    SalesInvoice,
    CreateSalesInvoice,
    UpdateSalesInvoice,
    CancelSalesInvoice,
} from "./sales-invoices.types";
import { ApiResponder } from "../../../shared/http/api-responder";
import { AuthUser } from "../../auth/auth.types";

export class SalesInvoicesController extends BaseController<
    SalesInvoice,
    CreateSalesInvoice,
    UpdateSalesInvoice
> {
    constructor(private readonly salesInvoicesService: SalesInvoicesService) {
        super(salesInvoicesService);
    }

    findDetails = async (req: Request, res: Response): Promise<void> => {
        const salesInvoiceId = Number(this.getId(res));

        const details = await this.salesInvoicesService.findDetails(salesInvoiceId);

        ApiResponder.ok(res, details, "Detalles de la factura obtenidos correctamente.");
    };

    cancel = async (req: Request, res: Response): Promise<void> => {
        const salesInvoiceId = Number(this.getId(res));

        const user = res.locals.authUser as AuthUser;
        const data = req.body as CancelSalesInvoice;

        const invoice = await this.salesInvoicesService.cancel(salesInvoiceId, data, user.user_id);

        ApiResponder.ok(res, invoice, "Factura cancelada correctamente.");
    };
}
