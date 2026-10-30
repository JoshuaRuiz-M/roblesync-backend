import { Router } from "express";

import { authenticate } from "../../../shared/middlewares/authenticate";
import { authorize } from "../../../shared/middlewares/authorize";
import { validateRequest } from "../../../shared/middlewares/validate-request";

import {
    createSupplierInvoicesSchema,
    updateSupplierInvoicesSchema,
} from "./suppliers-invoices.schema";

import { SupplierInvoicePermission } from "./suppliers-invoices.permissions";
import { SupplierInvoicesRepository } from "./suppliers-invoices.repository";
import { SupplierInvoicesService } from "./suppliers-invoices.service";
import { SupplierInvoicesController } from "./suppliers-invoices.controller";
import { numericIdSchema, paginationSchema } from "../../../shared/schemas/common.schema";

const router = Router();

const repository = new SupplierInvoicesRepository();
const service = new SupplierInvoicesService(repository);
const controller = new SupplierInvoicesController(service);

router.use(authenticate);

router.get(
    "/",
    authorize(SupplierInvoicePermission.SUPPLIER_INVOICE_READ),
    validateRequest({ query: paginationSchema }),
    controller.findAll,
);

router.get("/count", authorize(SupplierInvoicePermission.SUPPLIER_INVOICE_READ), controller.count);

router.get(
    "/:id",
    authorize(SupplierInvoicePermission.SUPPLIER_INVOICE_READ),
    validateRequest({ params: numericIdSchema }),
    controller.findById,
);

router.post(
    "/",
    authorize(SupplierInvoicePermission.SUPPLIER_INVOICE_CREATE),
    validateRequest({ body: createSupplierInvoicesSchema }),
    controller.create,
);

router.patch(
    "/:id",
    authorize(SupplierInvoicePermission.SUPPLIER_INVOICE_UPDATE),
    validateRequest({
        params: numericIdSchema,
        body: updateSupplierInvoicesSchema,
    }),
    controller.update,
);

router.delete(
    "/:id",
    authorize(SupplierInvoicePermission.SUPPLIER_INVOICE_DELETE),
    validateRequest({ params: numericIdSchema }),
    controller.delete,
);

export default router;
