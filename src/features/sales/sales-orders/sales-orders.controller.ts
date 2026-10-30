import type { Request, Response } from "express";

import { BaseController } from "../../../shared/controllers/base.controller";
import { ApiResponder } from "../../../shared/http/api-responder";

import type { AuthUser } from "../../auth/auth.types";

import { SalesOrdersService } from "./sales-orders.service";

import type { SalesOrder, CreateSalesOrder, UpdateSalesOrder } from "./sales-orders.types";

export class SalesOrdersController extends BaseController<
    SalesOrder,
    CreateSalesOrder,
    UpdateSalesOrder
> {
    constructor(private readonly salesOrdersService: SalesOrdersService) {
        super(salesOrdersService);
    }

    findDetails = async (_req: Request, res: Response): Promise<void> => {
        const id = Number(this.getId(res));

        const details = await this.salesOrdersService.findDetails(id);

        ApiResponder.ok(res, details);
    };

    submit = async (_req: Request, res: Response): Promise<void> => {
        const id = Number(this.getId(res));
        const { user_id } = res.locals.authUser as AuthUser;

        const order = await this.salesOrdersService.submit(id, user_id);

        ApiResponder.ok(res, order, "Orden de venta enviada correctamente.");
    };

    approve = async (_req: Request, res: Response): Promise<void> => {
        const id = Number(this.getId(res));
        const { user_id } = res.locals.authUser as AuthUser;

        const order = await this.salesOrdersService.approve(id, user_id);

        ApiResponder.ok(res, order, "Orden de venta aprobada correctamente.");
    };

    reserve = async (_req: Request, res: Response): Promise<void> => {
        const id = Number(this.getId(res));
        const { user_id } = res.locals.authUser as AuthUser;

        const order = await this.salesOrdersService.reserve(id, user_id);

        ApiResponder.ok(res, order, "Orden de venta reservada correctamente.");
    };

    cancel = async (_req: Request, res: Response): Promise<void> => {
        const id = Number(this.getId(res));
        const { user_id } = res.locals.authUser as AuthUser;

        const order = await this.salesOrdersService.cancel(id, user_id);

        ApiResponder.ok(res, order, "Orden de venta cancelada correctamente.");
    };

    approveCredit = async (_req: Request, res: Response): Promise<void> => {
        const id = Number(this.getId(res));
        const { user_id } = res.locals.authUser as AuthUser;

        const order = await this.salesOrdersService.approveCredit(id, user_id);

        ApiResponder.ok(res, order, "Crédito de la orden autorizado correctamente.");
    };

    rejectCredit = async (_req: Request, res: Response): Promise<void> => {
        const id = Number(this.getId(res));
        const { user_id } = res.locals.authUser as AuthUser;

        const order = await this.salesOrdersService.rejectCredit(id, user_id);

        ApiResponder.ok(res, order, "Crédito de la orden rechazado correctamente.");
    };
}
