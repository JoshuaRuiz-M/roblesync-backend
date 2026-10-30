import { HttpStatus } from "../../../shared/constants/http-status";
import { AppError } from "../../../shared/errors/app-error";
import { BaseService } from "../../../shared/services/base.service";

import { SalesOrdersRepository } from "./sales-orders.repository";

import type {
    SalesOrder,
    SalesOrderDetail,
    CreateSalesOrder,
    UpdateSalesOrder,
} from "./sales-orders.types";

export class SalesOrdersService extends BaseService<
    SalesOrder,
    CreateSalesOrder,
    UpdateSalesOrder
> {
    constructor(private readonly salesOrdersRepository: SalesOrdersRepository) {
        super(salesOrdersRepository, "Orden de venta");
    }

    async findDetails(salesOrderId: number): Promise<SalesOrderDetail[]> {
        await this.findById(salesOrderId);

        return this.salesOrdersRepository.findDetails(salesOrderId);
    }

    async submit(salesOrderId: number, userId: number): Promise<SalesOrder> {
        const order = await this.findById(salesOrderId);

        if (order.status !== "DRAFT") {
            throw new AppError(
                HttpStatus.CONFLICT,
                "Solo se pueden enviar órdenes de venta en borrador.",
            );
        }

        const details = await this.salesOrdersRepository.findDetails(salesOrderId);

        if (details.length === 0) {
            throw new AppError(
                HttpStatus.BAD_REQUEST,
                "La orden debe contener al menos un producto.",
            );
        }

        return this.salesOrdersRepository.changeStatus(salesOrderId, "DRAFT", "PENDING", userId);
    }

    async approve(salesOrderId: number, userId: number): Promise<SalesOrder> {
        const order = await this.findById(salesOrderId);

        if (order.status !== "PENDING") {
            throw new AppError(
                HttpStatus.CONFLICT,
                "Solo se pueden aprobar órdenes de venta pendientes.",
            );
        }

        if (order.credit_status === "REJECTED") {
            throw new AppError(
                HttpStatus.CONFLICT,
                "No se puede aprobar una orden con crédito rechazado.",
            );
        }

        return this.salesOrdersRepository.changeStatus(salesOrderId, "PENDING", "APPROVED", userId);
    }

    async reserve(salesOrderId: number, userId: number): Promise<SalesOrder> {
        return this.salesOrdersRepository.reserve(salesOrderId, userId);
    }

    async cancel(salesOrderId: number, userId: number): Promise<SalesOrder> {
        return this.salesOrdersRepository.cancel(salesOrderId, userId);
    }

    async approveCredit(salesOrderId: number, userId: number): Promise<SalesOrder> {
        return this.salesOrdersRepository.approveCredit(salesOrderId, userId);
    }

    async rejectCredit(salesOrderId: number, userId: number): Promise<SalesOrder> {
        return this.salesOrdersRepository.rejectCredit(salesOrderId, userId);
    }
}
