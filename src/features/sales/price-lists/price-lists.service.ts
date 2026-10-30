import { BaseService } from "../../../shared/services/base.service";

import { PriceListsRepository } from "./price-lists.repository";

import type {
    PriceList,
    PriceListDetail,
    CreatePriceList,
    UpdatePriceList,
} from "./price-lists.types";

export class PriceListsService extends BaseService<PriceList, CreatePriceList, UpdatePriceList> {
    constructor(private readonly priceListsRepository: PriceListsRepository) {
        super(priceListsRepository, "Price list");
    }

    async findDetails(id: number): Promise<PriceListDetail[]> {
        await this.findById(id);

        return this.priceListsRepository.findDetails(id);
    }
}
