import { HttpStatus } from "../../../shared/constants/http-status";
import { AppError } from "../../../shared/errors/app-error";
import { BaseService } from "../../../shared/services/base.service";
import { GoodsReceiptsRepository } from "./goods-receipts.repository";

import type {
    GoodsReceipt,
    GoodsReceiptDetail,
    CreateGoodsReceipt,
    UpdateGoodsReceipt,
} from "./goods-receipts.types";

export class GoodsReceiptsService extends BaseService<
    GoodsReceipt,
    CreateGoodsReceipt,
    UpdateGoodsReceipt
> {
    constructor(private readonly goodsReceiptsRepository: GoodsReceiptsRepository) {
        super(goodsReceiptsRepository, "Recepción de mercancías");
    }

    async findDetails(goodsReceiptId: number): Promise<GoodsReceiptDetail[]> {
        await this.findById(goodsReceiptId);

        return this.goodsReceiptsRepository.findDetails(goodsReceiptId);
    }

    async confirm(goodsReceiptId: number, userId: number): Promise<GoodsReceipt> {
        return this.goodsReceiptsRepository.confirm(goodsReceiptId, userId);
    }

    async cancel(goodsReceiptId: number, userId: number): Promise<GoodsReceipt> {
        const receipt = await this.findById(goodsReceiptId);

        if (receipt.status !== "DRAFT") {
            throw new AppError(
                HttpStatus.CONFLICT,
                "Solo se pueden cancelar recepciones en borrador",
            );
        }

        return this.goodsReceiptsRepository.cancel(goodsReceiptId, userId);
    }
}
