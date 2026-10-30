import type { Request, Response } from "express";

import { BaseController } from "../../../shared/controllers/base.controller";
import { ApiResponder } from "../../../shared/http/api-responder";

import type { AuthUser } from "../../auth/auth.types";

import { WarehouseTransfersService } from "./warehouse-transfers.service";

import type {
    WarehouseTransfer,
    CreateWarehouseTransfer,
    UpdateWarehouseTransfer,
} from "./warehouse-transfers.types";

export class WarehouseTransfersController extends BaseController<
    WarehouseTransfer,
    CreateWarehouseTransfer,
    UpdateWarehouseTransfer
> {
    constructor(protected readonly service: WarehouseTransfersService) {
        super(service);
    }

    findDetails = async (_req: Request, res: Response): Promise<void> => {
        const id = Number(this.getId(res));

        const details = await this.service.findDetails(id);

        ApiResponder.ok(res, details);
    };

    dispatch = async (_req: Request, res: Response): Promise<void> => {
        const id = Number(this.getId(res));

        const { user_id } = res.locals.authUser as AuthUser;

        const transfer = await this.service.dispatch(id, user_id);

        ApiResponder.ok(res, transfer, "Transferencia despachada correctamente.");
    };

    receive = async (_req: Request, res: Response): Promise<void> => {
        const id = Number(this.getId(res));

        const { user_id } = res.locals.authUser as AuthUser;

        const transfer = await this.service.receive(id, user_id);

        ApiResponder.ok(res, transfer, "Transferencia recibida correctamente.");
    };

    cancel = async (_req: Request, res: Response): Promise<void> => {
        const id = Number(this.getId(res));

        const { user_id } = res.locals.authUser as AuthUser;

        const transfer = await this.service.cancel(id, user_id);

        ApiResponder.ok(res, transfer, "Transferencia cancelada correctamente.");
    };
}
