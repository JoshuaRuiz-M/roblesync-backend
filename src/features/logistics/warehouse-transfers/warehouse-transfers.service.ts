import { BaseService } from "../../../shared/services/base.service";

import { WarehouseTransfersRepository } from "./warehouse-transfers.repository";

import type {
    WarehouseTransfer,
    WarehouseTransferDetail,
    CreateWarehouseTransfer,
    UpdateWarehouseTransfer,
} from "./warehouse-transfers.types";

export class WarehouseTransfersService extends BaseService<
    WarehouseTransfer,
    CreateWarehouseTransfer,
    UpdateWarehouseTransfer
> {
    constructor(protected readonly repository: WarehouseTransfersRepository) {
        super(repository, "Transferencia");
    }

    async findDetails(id: number): Promise<WarehouseTransferDetail[]> {
        await this.findById(id);

        return this.repository.findDetails(id);
    }

    async dispatch(id: number, userId: number): Promise<WarehouseTransfer> {
        return this.repository.dispatch(id, userId);
    }

    async receive(id: number, userId: number): Promise<WarehouseTransfer> {
        return this.repository.receive(id, userId);
    }

    async cancel(id: number, userId: number): Promise<WarehouseTransfer> {
        return this.repository.cancel(id, userId);
    }
}
