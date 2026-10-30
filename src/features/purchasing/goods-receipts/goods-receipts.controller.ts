import type { Request, Response } from "express";

import { BaseController } from "../../../shared/controllers/base.controller";
import { ApiResponder } from "../../../shared/http/api-responder";

import type { AuthUser } from "../../auth/auth.types";

import { GoodsReceiptsService } from "./goods-receipts.service";

import type { GoodsReceipt, CreateGoodsReceipt, UpdateGoodsReceipt } from "./goods-receipts.types";

export class GoodsReceiptsController extends BaseController<
    GoodsReceipt,
    CreateGoodsReceipt,
    UpdateGoodsReceipt
> {
    constructor(private readonly goodsReceiptsService: GoodsReceiptsService) {
        super(goodsReceiptsService);
    }

    findDetails = async (_req: Request, res: Response): Promise<void> => {
        const id = Number(this.getId(res));

        const details = await this.goodsReceiptsService.findDetails(id);

        ApiResponder.ok(res, details);
    };

    confirm = async (_req: Request, res: Response): Promise<void> => {
        const id = Number(this.getId(res));
        const { user_id } = res.locals.authUser as AuthUser;

        const receipt = await this.goodsReceiptsService.confirm(id, user_id);

        ApiResponder.ok(res, receipt, "Recepción confirmada correctamente.");
    };

    cancel = async (_req: Request, res: Response): Promise<void> => {
        const id = Number(this.getId(res));
        const { user_id } = res.locals.authUser as AuthUser;

        const receipt = await this.goodsReceiptsService.cancel(id, user_id);

        ApiResponder.ok(res, receipt, "Recepción cancelada correctamente.");
    };
}
