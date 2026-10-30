import { Router } from "express";

import { authenticate } from "../../../shared/middlewares/authenticate";
import { authorize } from "../../../shared/middlewares/authorize";
import { validateRequest } from "../../../shared/middlewares/validate-request";

import { numericIdSchema, paginationSchema } from "../../../shared/schemas/common.schema";

import { createSalesInvoiceSchema, cancelSalesInvoiceSchema } from "./sales-invoices.schema";

import { SalesInvoicePermission } from "./sales-invoices.permissions";
import { SalesInvoicesRepository } from "./sales-invoices.repository";
import { SalesInvoicesService } from "./sales-invoices.service";
import { SalesInvoicesController } from "./sales-invoices.controller";

const router = Router();

const repository = new SalesInvoicesRepository();
const service = new SalesInvoicesService(repository);
const controller = new SalesInvoicesController(service);

router.use(authenticate);

router.get(
    "/",
    authorize(SalesInvoicePermission.SALES_INVOICE_READ),
    validateRequest({ query: paginationSchema }),
    controller.findAll,
);

router.post(
    "/",
    authorize(SalesInvoicePermission.SALES_INVOICE_CREATE),
    validateRequest({ body: createSalesInvoiceSchema }),
    controller.create,
);

router.get("/count", authorize(SalesInvoicePermission.SALES_INVOICE_READ), controller.count);

router.get(
    "/:id/details",
    authorize(SalesInvoicePermission.SALES_INVOICE_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findDetails,
);

router.get(
    "/:id",
    authorize(SalesInvoicePermission.SALES_INVOICE_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findById,
);

router.patch(
    "/:id/cancel",
    authorize(SalesInvoicePermission.SALES_INVOICE_CANCEL),
    validateRequest({
        params: numericIdSchema,
        body: cancelSalesInvoiceSchema,
    }),
    controller.cancel,
);

export default router;
