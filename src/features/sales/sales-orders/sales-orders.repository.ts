import { randomUUID } from "node:crypto";
import type { Knex } from "knex";

import { BaseRepository } from "../../../shared/repositories/base.repository";
import { AppError } from "../../../shared/errors/app-error";
import { HttpStatus } from "../../../shared/constants/http-status";

import { createSalesOrderSchema, updateSalesOrderSchema } from "./sales-orders.schema";

import type {
    SalesOrder,
    SalesOrderDetail,
    SalesOrderStatus,
    CreateSalesOrder,
    UpdateSalesOrder,
    CreateSalesOrderDetail,
} from "./sales-orders.types";

import { InventoryRepository } from "../../inventory/repositories/inventory.repository";

const TAX_RATE_PERCENT = 12;
const MAX_AMOUNT_CENTS = 99_999_999_999_999_999n;

type CalculatedDetail = {
    product_id: number;
    quantity: number;
    unit_price: number;
    discount_amount: number;
    subtotal: number;
    tax_amount: number;
    total_amount: number;
};

type CalculatedTotals = {
    subtotal: number;
    discount_amount: number;
    tax_amount: number;
    total_amount: number;
};

export class SalesOrdersRepository extends BaseRepository<
    SalesOrder,
    CreateSalesOrder,
    UpdateSalesOrder
> {
    constructor() {
        super({
            schema: "sales",
            table: "sales_orders",
            primaryKey: "sales_order_id",
            columns: [
                "sales_order_id",
                "order_number",
                "customer_id",
                "salesperson_id",
                "warehouse_id",
                "order_date",
                "status",
                "credit_status",
                "credit_authorized_at",
                "credit_authorized_by",
                "subtotal",
                "discount_amount",
                "tax_amount",
                "total_amount",
                "notes",
                "created_at",
                "created_by",
                "updated_at",
                "updated_by",
            ],
            hasAuditFields: true,
            hasUserFields: true,
            schemas: {
                create: createSalesOrderSchema,
                update: updateSalesOrderSchema,
            },
        });
    }

    private badRequest(message: string): AppError {
        return new AppError(HttpStatus.BAD_REQUEST, message);
    }

    private conflict(message: string): AppError {
        return new AppError(HttpStatus.CONFLICT, message);
    }

    private notFound(id: number): AppError {
        return new AppError(HttpStatus.NOT_FOUND, `Orden de venta con ID ${id} no encontrada.`);
    }

    async findDetails(salesOrderId: number): Promise<SalesOrderDetail[]> {
        return this.db
            .withSchema("sales")
            .table("sales_order_details")
            .where("sales_order_id", salesOrderId)
            .select("*")
            .orderBy("sales_order_detail_id", "asc");
    }

    private toScaledInteger(value: number, scale: number, field: string): bigint {
        if (!Number.isFinite(value) || value < 0) {
            throw this.badRequest(`El campo ${field} contiene un valor inválido.`);
        }

        const scaled = value * scale;
        const rounded = Math.round(scaled);

        if (!Number.isSafeInteger(rounded) || Math.abs(scaled - rounded) > 0.000001) {
            throw this.badRequest(`El campo ${field} excede la precisión permitida.`);
        }

        return BigInt(rounded);
    }

    private roundDivide(numerator: bigint, denominator: bigint): bigint {
        return (numerator + denominator / 2n) / denominator;
    }

    private assertAmount(amountCents: bigint, field: string): void {
        if (
            amountCents < 0n ||
            amountCents > MAX_AMOUNT_CENTS ||
            amountCents > BigInt(Number.MAX_SAFE_INTEGER)
        ) {
            throw this.badRequest(`El importe ${field} excede el límite permitido.`);
        }
    }

    private calculateDetails(details: CreateSalesOrderDetail[]): CalculatedDetail[] {
        return details.map((detail) => {
            const quantityUnits = this.toScaledInteger(detail.quantity, 1_000, "quantity");

            const unitPriceUnits = this.toScaledInteger(detail.unit_price, 10_000, "unit_price");

            const discountCents = this.toScaledInteger(
                detail.discount_amount ?? 0,
                100,
                "discount_amount",
            );

            const subtotalCents = this.roundDivide(quantityUnits * unitPriceUnits, 100_000n);

            if (discountCents > subtotalCents) {
                throw this.badRequest(
                    `El descuento del producto ${detail.product_id} supera su importe.`,
                );
            }

            const taxableCents = subtotalCents - discountCents;

            const taxCents = this.roundDivide(taxableCents * BigInt(TAX_RATE_PERCENT), 100n);

            const totalCents = taxableCents + taxCents;

            this.assertAmount(subtotalCents, "subtotal");
            this.assertAmount(discountCents, "discount_amount");
            this.assertAmount(taxCents, "tax_amount");
            this.assertAmount(totalCents, "total_amount");

            return {
                product_id: detail.product_id,
                quantity: detail.quantity,
                unit_price: detail.unit_price,
                discount_amount: Number(discountCents) / 100,
                subtotal: Number(subtotalCents) / 100,
                tax_amount: Number(taxCents) / 100,
                total_amount: Number(totalCents) / 100,
            };
        });
    }

    private calculateTotals(details: CalculatedDetail[]): CalculatedTotals {
        let subtotalCents = 0n;
        let discountCents = 0n;
        let taxCents = 0n;
        let totalCents = 0n;

        for (const detail of details) {
            subtotalCents += this.toScaledInteger(detail.subtotal, 100, "subtotal");

            discountCents += this.toScaledInteger(detail.discount_amount, 100, "discount_amount");

            taxCents += this.toScaledInteger(detail.tax_amount, 100, "tax_amount");

            totalCents += this.toScaledInteger(detail.total_amount, 100, "total_amount");
        }

        this.assertAmount(subtotalCents, "subtotal");
        this.assertAmount(discountCents, "discount_amount");
        this.assertAmount(taxCents, "tax_amount");
        this.assertAmount(totalCents, "total_amount");

        return {
            subtotal: Number(subtotalCents) / 100,
            discount_amount: Number(discountCents) / 100,
            tax_amount: Number(taxCents) / 100,
            total_amount: Number(totalCents) / 100,
        };
    }

    private async validateCustomer(trx: Knex.Transaction, customerId: number): Promise<void> {
        const customer = await trx("sales.customers")
            .where({
                customer_id: customerId,
                is_active: true,
            })
            .first("customer_id");

        if (!customer) {
            throw this.badRequest("El cliente no existe o se encuentra inactivo.");
        }
    }

    private async validateSalesperson(trx: Knex.Transaction, salespersonId: number): Promise<void> {
        const salesperson = await trx("sales.salespersons")
            .where("salesperson_id", salespersonId)
            .first("salesperson_id");

        if (!salesperson) {
            throw this.badRequest("El vendedor seleccionado no existe.");
        }
    }

    private async validateWarehouse(trx: Knex.Transaction, warehouseId: number): Promise<void> {
        const warehouse = await trx("inventory.warehouses")
            .where({
                warehouse_id: warehouseId,
                is_active: true,
            })
            .first("warehouse_id");

        if (!warehouse) {
            throw this.badRequest("El almacén seleccionado no existe o está inactivo.");
        }
    }

    private async validateProducts(
        trx: Knex.Transaction,
        details: CreateSalesOrderDetail[],
    ): Promise<void> {
        const productIds = details.map((detail) => detail.product_id);

        const products = await trx("catalog.products")
            .whereIn("product_id", productIds)
            .where("is_active", true)
            .select("product_id");

        const activeIds = new Set(products.map((product) => Number(product.product_id)));

        const invalidIds = productIds.filter((productId) => !activeIds.has(productId));

        if (invalidIds.length > 0) {
            throw this.badRequest(
                `Los productos ${invalidIds.join(", ")} no existen o están inactivos.`,
            );
        }
    }

    private async validateCustomerCredit(
        trx: Knex.Transaction,
        customerId: number,
    ): Promise<{
        credit_limit: number;
        credit_days: number;
    }> {
        const customer = await trx("sales.customers")
            .where("customer_id", customerId)
            .forUpdate()
            .first();

        if (!customer) {
            throw new AppError(HttpStatus.NOT_FOUND, "El cliente no existe.");
        }

        if (!customer.is_active) {
            throw this.conflict("El cliente se encuentra inactivo.");
        }

        if (customer.is_credit_blocked) {
            throw this.conflict("El cliente tiene bloqueado el crédito.");
        }

        if (Number(customer.credit_days) <= 0) {
            throw this.conflict("El cliente no tiene habilitadas compras a crédito.");
        }

        if (Number(customer.credit_limit) <= 0) {
            throw this.conflict("El cliente no tiene un límite de crédito autorizado.");
        }

        return {
            credit_limit: Number(customer.credit_limit),
            credit_days: Number(customer.credit_days),
        };
    }

    override async create(data: CreateSalesOrder, user_id: number): Promise<SalesOrder> {
        const validated = createSalesOrderSchema.parse(data);

        const salesOrderId = await this.db.transaction(async (trx) => {
            await this.validateCustomer(trx, validated.customer_id);

            await this.validateSalesperson(trx, validated.salesperson_id);

            await this.validateWarehouse(trx, validated.warehouse_id);

            await this.validateProducts(trx, validated.details);

            const details = this.calculateDetails(validated.details);

            const totals = this.calculateTotals(details);

            const [created] = await trx("sales.sales_orders")
                .insert({
                    order_number: `TMP-${randomUUID()}`,
                    customer_id: validated.customer_id,
                    salesperson_id: validated.salesperson_id,
                    warehouse_id: validated.warehouse_id,
                    order_date: trx.raw("SYSUTCDATETIME()"),
                    status: "DRAFT",
                    credit_status: "PENDING",
                    ...totals,
                    notes: validated.notes ?? null,
                    created_at: trx.raw("SYSUTCDATETIME()"),
                    created_by: user_id,
                })
                .returning("sales_order_id");

            const id = Number(created.sales_order_id);

            const orderNumber = `OV-${String(id).padStart(6, "0")}`;

            await trx("sales.sales_orders").where("sales_order_id", id).update({
                order_number: orderNumber,
            });

            await trx("sales.sales_order_details").insert(
                details.map((detail) => ({
                    sales_order_id: id,
                    ...detail,
                    quantity_reserved: 0,
                    created_at: trx.raw("SYSUTCDATETIME()"),
                    created_by: user_id,
                })),
            );

            return id;
        });

        const order = await this.findById(salesOrderId);

        if (!order) {
            throw this.notFound(salesOrderId);
        }

        return order;
    }

    override async update(
        id: number,
        data: UpdateSalesOrder,
        user_id: number,
    ): Promise<SalesOrder | null> {
        const validated = updateSalesOrderSchema.parse(data);

        const updated = await this.db.transaction(async (trx) => {
            const existing = await trx("sales.sales_orders")
                .where("sales_order_id", id)
                .forUpdate()
                .first();

            if (!existing) {
                return false;
            }

            if (existing.status !== "DRAFT") {
                throw this.conflict("Solo se pueden modificar órdenes de venta en borrador.");
            }

            const customerId = validated.customer_id ?? Number(existing.customer_id);

            const salespersonId = validated.salesperson_id ?? Number(existing.salesperson_id);

            const warehouseId = validated.warehouse_id ?? Number(existing.warehouse_id);

            await this.validateCustomer(trx, customerId);
            await this.validateSalesperson(trx, salespersonId);
            await this.validateWarehouse(trx, warehouseId);

            const headerUpdates: Record<string, unknown> = {
                customer_id: customerId,
                salesperson_id: salespersonId,
                warehouse_id: warehouseId,
                updated_at: trx.raw("SYSUTCDATETIME()"),
                updated_by: user_id,
            };

            if (validated.notes !== undefined) {
                headerUpdates.notes = validated.notes;
            }

            if (validated.details !== undefined) {
                await this.validateProducts(trx, validated.details);

                const details = this.calculateDetails(validated.details);

                const totals = this.calculateTotals(details);

                Object.assign(headerUpdates, totals);

                await trx("sales.sales_order_details").where("sales_order_id", id).delete();

                await trx("sales.sales_order_details").insert(
                    details.map((detail) => ({
                        sales_order_id: id,
                        ...detail,
                        quantity_reserved: 0,
                        created_at: trx.raw("SYSUTCDATETIME()"),
                        created_by: user_id,
                    })),
                );
            }

            await trx("sales.sales_orders").where("sales_order_id", id).update(headerUpdates);

            return true;
        });

        return updated ? this.findById(id) : null;
    }

    async changeStatus(
        id: number,
        currentStatus: SalesOrderStatus,
        newStatus: SalesOrderStatus,
        userId: number,
    ): Promise<SalesOrder> {
        const affectedRows = await this.query()
            .where("sales_order_id", id)
            .where("status", currentStatus)
            .update({
                status: newStatus,
                updated_at: this.db.raw("SYSUTCDATETIME()"),
                updated_by: userId,
            });

        if (affectedRows === 0) {
            const existing = await this.findById(id);

            throw new AppError(
                existing ? HttpStatus.CONFLICT : HttpStatus.NOT_FOUND,
                existing
                    ? `No se puede cambiar una orden de ${existing.status} a ${newStatus}.`
                    : `Orden de venta con ID ${id} no encontrada.`,
            );
        }

        const updated = await this.findById(id);

        if (!updated) {
            throw this.notFound(id);
        }

        return updated;
    }

    async reserve(id: number, userId: number): Promise<SalesOrder> {
        await this.db.transaction(async (trx) => {
            const order = await trx("sales.sales_orders")
                .where("sales_order_id", id)
                .forUpdate()
                .first();

            if (!order) {
                throw this.notFound(id);
            }

            if (order.status !== "APPROVED") {
                throw this.conflict("Solo se pueden reservar órdenes de venta aprobadas.");
            }

            if (order.credit_status === "REJECTED") {
                throw this.conflict("No se puede reservar una orden con crédito rechazado.");
            }

            const details = await trx("sales.sales_order_details")
                .where("sales_order_id", id)
                .orderBy("product_id", "asc")
                .select();

            if (details.length === 0) {
                throw this.conflict("La orden no contiene productos.");
            }

            const inventory = new InventoryRepository();

            for (const detail of details) {
                const quantity = Number(detail.quantity);
                const reserved = Number(detail.quantity_reserved);

                if (reserved !== 0) {
                    throw this.conflict("La orden ya contiene cantidades reservadas.");
                }

                await inventory.reserveStock(trx, {
                    warehouse_id: Number(order.warehouse_id),
                    product_id: Number(detail.product_id),
                    quantity,
                    user_id: userId,
                });

                await trx("sales.sales_order_details")
                    .where("sales_order_detail_id", detail.sales_order_detail_id)
                    .update({
                        quantity_reserved: quantity,
                        updated_at: trx.raw("SYSUTCDATETIME()"),
                        updated_by: userId,
                    });
            }

            await trx("sales.sales_orders")
                .where("sales_order_id", id)
                .update({
                    status: "RESERVED",
                    updated_at: trx.raw("SYSUTCDATETIME()"),
                    updated_by: userId,
                });
        });

        const order = await this.findById(id);

        if (!order) {
            throw this.notFound(id);
        }

        return order;
    }

    async cancel(id: number, userId: number): Promise<SalesOrder> {
        await this.db.transaction(async (trx) => {
            const order = await trx("sales.sales_orders")
                .where("sales_order_id", id)
                .forUpdate()
                .first();

            if (!order) {
                throw this.notFound(id);
            }

            if (order.status === "COMPLETED" || order.status === "CANCELLED") {
                throw this.conflict("No se puede cancelar una orden completada o cancelada.");
            }

            const details = await trx("sales.sales_order_details")
                .where("sales_order_id", id)
                .orderBy("product_id", "asc")
                .select();

            const inventory = new InventoryRepository();

            for (const detail of details) {
                const reserved = Number(detail.quantity_reserved);

                if (reserved > 0) {
                    await inventory.releaseReservedStock(trx, {
                        warehouse_id: Number(order.warehouse_id),
                        product_id: Number(detail.product_id),
                        quantity: reserved,
                        user_id: userId,
                    });

                    await trx("sales.sales_order_details")
                        .where("sales_order_detail_id", detail.sales_order_detail_id)
                        .update({
                            quantity_reserved: 0,
                            updated_at: trx.raw("SYSUTCDATETIME()"),
                            updated_by: userId,
                        });
                }
            }

            await trx("sales.sales_orders")
                .where("sales_order_id", id)
                .update({
                    status: "CANCELLED",
                    updated_at: trx.raw("SYSUTCDATETIME()"),
                    updated_by: userId,
                });
        });

        const order = await this.findById(id);

        if (!order) {
            throw this.notFound(id);
        }

        return order;
    }

    async approveCredit(id: number, userId: number): Promise<SalesOrder> {
        await this.db.transaction(async (trx) => {
            const order = await trx("sales.sales_orders")
                .where("sales_order_id", id)
                .forUpdate()
                .first();

            if (!order) {
                throw this.notFound(id);
            }

            if (order.status !== "PENDING") {
                throw this.conflict("Solo se puede autorizar crédito a órdenes pendientes.");
            }

            if (order.credit_status !== "PENDING") {
                throw this.conflict("La orden no tiene una autorización de crédito pendiente.");
            }

            const customer = await this.validateCustomerCredit(trx, Number(order.customer_id));

            if (Number(order.total_amount) > customer.credit_limit) {
                throw this.conflict(
                    "El total de la orden supera el límite de crédito del cliente.",
                );
            }

            await trx("sales.sales_orders")
                .where("sales_order_id", id)
                .update({
                    credit_status: "APPROVED",
                    credit_authorized_at: trx.raw("SYSUTCDATETIME()"),
                    credit_authorized_by: userId,
                    updated_at: trx.raw("SYSUTCDATETIME()"),
                    updated_by: userId,
                });
        });

        const order = await this.findById(id);

        if (!order) {
            throw this.notFound(id);
        }

        return order;
    }

    async rejectCredit(id: number, userId: number): Promise<SalesOrder> {
        await this.db.transaction(async (trx) => {
            const order = await trx("sales.sales_orders")
                .where("sales_order_id", id)
                .forUpdate()
                .first();

            if (!order) {
                throw this.notFound(id);
            }

            if (order.status !== "PENDING") {
                throw this.conflict("Solo se puede rechazar crédito de órdenes pendientes.");
            }

            if (order.credit_status !== "PENDING") {
                throw this.conflict("La orden no tiene una autorización de crédito pendiente.");
            }

            await trx("sales.sales_orders")
                .where("sales_order_id", id)
                .update({
                    credit_status: "REJECTED",
                    credit_authorized_at: null,
                    credit_authorized_by: null,
                    updated_at: trx.raw("SYSUTCDATETIME()"),
                    updated_by: userId,
                });
        });

        const order = await this.findById(id);

        if (!order) {
            throw this.notFound(id);
        }

        return order;
    }
}
