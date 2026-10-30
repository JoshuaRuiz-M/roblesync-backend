import type { Request, Response } from "express";

import { BaseController } from "../../../shared/controllers/base.controller";
import { ApiResponder } from "../../../shared/http/api-responder";

import { PriceListsService } from "./price-lists.service";

import type { PriceList, CreatePriceList, UpdatePriceList } from "./price-lists.types";

export class PriceListsController extends BaseController<
    PriceList,
    CreatePriceList,
    UpdatePriceList
> {
    constructor(private readonly priceListsService: PriceListsService) {
        super(priceListsService);
    }

    findDetails = async (_req: Request, res: Response): Promise<void> => {
        const id = this.getId(res);

        const details = await this.priceListsService.findDetails(Number(id));

        ApiResponder.ok(res, details);
    };
}
