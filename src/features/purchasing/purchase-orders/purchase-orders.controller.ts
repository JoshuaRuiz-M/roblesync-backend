import type { Request, Response } from "express";

import { PurchaseOrdersService } from "./purchase-orders.service";

import { ApiResponder } from "../../../shared/http/api-responder";
import { getValidated } from "../../../shared/http/validated-request";

import type { PaginationParams } from "../../../shared/http/pagination";
import type { AuthUser } from "../../auth/auth.types";

import type { CreatePurchaseOrderInput, UpdatePurchaseOrderInput } from "./purchase-orders.schema";

export class PurchaseOrdersController {
    private readonly service = new PurchaseOrdersService();

    private getId(res: Response): number {
        const params = getValidated<{ id: number }>(res, "params");

        return params.id;
    }

    findAll = async (_req: Request, res: Response): Promise<void> => {
        const params = getValidated<PaginationParams>(res, "query");

        const result = await this.service.findAll(params);

        ApiResponder.paginated(res, result);
    };

    findById = async (_req: Request, res: Response): Promise<void> => {
        const id = this.getId(res);

        const order = await this.service.findById(id);

        ApiResponder.ok(res, order);
    };

    count = async (_req: Request, res: Response): Promise<void> => {
        const total = await this.service.count();

        ApiResponder.ok(res, { total });
    };

    create = async (_req: Request, res: Response): Promise<void> => {
        const { user_id } = res.locals.authUser as AuthUser;

        const data = getValidated<CreatePurchaseOrderInput>(res, "body");

        const order = await this.service.create(data, user_id);

        ApiResponder.created(res, order, "Orden de compra creada correctamente.");
    };

    update = async (_req: Request, res: Response): Promise<void> => {
        const { user_id } = res.locals.authUser as AuthUser;

        const id = this.getId(res);

        const data = getValidated<UpdatePurchaseOrderInput>(res, "body");

        const order = await this.service.update(id, data, user_id);

        ApiResponder.ok(res, order, "Orden de compra actualizada correctamente.");
    };

    approve = async (_req: Request, res: Response): Promise<void> => {
        const { user_id } = res.locals.authUser as AuthUser;

        const id = this.getId(res);

        const order = await this.service.approve(id, user_id);

        ApiResponder.ok(res, order, "Orden de compra aprobada correctamente.");
    };

    cancel = async (_req: Request, res: Response): Promise<void> => {
        const { user_id } = res.locals.authUser as AuthUser;

        const id = this.getId(res);

        const order = await this.service.cancel(id, user_id);

        ApiResponder.ok(res, order, "Orden de compra cancelada correctamente.");
    };
}
