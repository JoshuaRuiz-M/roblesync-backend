import { BaseRepository } from "../../../shared/repositories/base.repository";

import { createProductsSchema, updateProductsSchema } from "./products.schema";

import type {
    CreateProductSupplier,
    Product,
    ProductSupplier,
    ProductSupplierDetail,
} from "./products.types";

import type { CreateProductsInput, UpdateProductsInput } from "./products.schema";
import { HttpStatus } from "../../../shared/constants/http-status";
import { AppError } from "../../../shared/errors/app-error";

export class ProductsRepository extends BaseRepository<
    Product,
    CreateProductsInput,
    UpdateProductsInput
> {
    constructor() {
        super({
            schema: "catalog",
            table: "products",
            primaryKey: "product_id",
            columns: [
                "product_id",
                "brand_id",
                "product_line_id",
                "unit_of_measure_id",
                "sku",
                "barcode",
                "name",
                "description",
                "weight",
                "average_cost",
                "list_price",
                "minimum_stock",
                "maximum_stock",
                "reorder_point",
                "tracks_expiration",
                "is_active",
                "created_at",
                "created_by",
                "updated_at",
                "updated_by",
            ],
            hasAuditFields: true,
            hasUserFields: true,
            schemas: {
                create: createProductsSchema,
                update: updateProductsSchema,
            },
        });
    }

    async getSuppliers(productId: number): Promise<ProductSupplierDetail[]> {
        return this.db("purchasing.product_suppliers as ps")
            .innerJoin("purchasing.suppliers as s", "ps.supplier_id", "s.supplier_id")
            .select("ps.*", "s.tax_id", "s.business_name", "s.contact_name", "s.phone", "s.email")
            .where("ps.product_id", productId)
            .orderBy("ps.is_preferred", "desc")
            .orderBy("s.business_name", "asc");
    }

    async findProductSupplier(
        productId: number,
        supplierId: number,
    ): Promise<ProductSupplier | undefined> {
        return this.db<ProductSupplier>("purchasing.product_suppliers")
            .where({
                product_id: productId,
                supplier_id: supplierId,
            })
            .first();
    }

    async findSupplierById(
        supplierId: number,
    ): Promise<{ supplier_id: number; is_active: boolean } | undefined> {
        return this.db("purchasing.suppliers")
            .select("supplier_id", "is_active")
            .where("supplier_id", supplierId)
            .first();
    }

    async saveProductSupplier(
        productId: number,
        data: CreateProductSupplier,
        userId: number,
    ): Promise<ProductSupplier> {
        return this.db.transaction(async (trx) => {
            const existing = await trx("purchasing.product_suppliers")
                .where({
                    product_id: productId,
                    supplier_id: data.supplier_id,
                })
                .first();

            if (existing?.is_active) {
                throw new AppError(
                    HttpStatus.CONFLICT,
                    "El proveedor ya está asociado a este producto.",
                );
            }

            const isActive = data.is_active ?? true;
            const isPreferred = isActive && (data.is_preferred ?? false);

            if (isPreferred) {
                await trx("purchasing.product_suppliers")
                    .where({
                        product_id: productId,
                        is_preferred: true,
                    })
                    .update({
                        is_preferred: false,
                        updated_at: trx.raw("SYSUTCDATETIME()"),
                        updated_by: userId,
                    });
            }

            let productSupplierId: number;

            if (existing) {
                productSupplierId = existing.product_supplier_id;

                await trx("purchasing.product_suppliers")
                    .where("product_supplier_id", productSupplierId)
                    .update({
                        is_active: isActive,
                        is_preferred: isPreferred,
                        updated_at: trx.raw("SYSUTCDATETIME()"),
                        updated_by: userId,
                    });
            } else {
                const [created] = await trx("purchasing.product_suppliers")
                    .insert({
                        product_id: productId,
                        supplier_id: data.supplier_id,
                        is_active: isActive,
                        is_preferred: isPreferred,
                        created_at: trx.raw("SYSUTCDATETIME()"),
                        created_by: userId,
                    })
                    .returning("product_supplier_id");

                productSupplierId = created.product_supplier_id;
            }

            return trx<ProductSupplier>("purchasing.product_suppliers")
                .where("product_supplier_id", productSupplierId)
                .first() as Promise<ProductSupplier>;
        });
    }

    async updateProductSupplier(
        productId: number,
        supplierId: number,
        data: {
            is_active: boolean;
            is_preferred: boolean;
            updated_by: number;
        },
    ): Promise<ProductSupplier> {
        return this.db.transaction(async (trx) => {
            const existing = await trx("purchasing.product_suppliers")
                .where({
                    product_id: productId,
                    supplier_id: supplierId,
                })
                .first();

            if (!existing) {
                throw new AppError(HttpStatus.NOT_FOUND, "La asociación no existe.");
            }

            if (data.is_preferred && !data.is_active) {
                throw new AppError(
                    HttpStatus.BAD_REQUEST,
                    "Un proveedor inactivo no puede ser preferido.",
                );
            }

            if (data.is_preferred) {
                await trx("purchasing.product_suppliers")
                    .where("product_id", productId)
                    .where("is_preferred", true)
                    .whereNot("supplier_id", supplierId)
                    .update({
                        is_preferred: false,
                        updated_at: trx.raw("SYSUTCDATETIME()"),
                        updated_by: data.updated_by,
                    });
            }

            await trx("purchasing.product_suppliers")
                .where({
                    product_id: productId,
                    supplier_id: supplierId,
                })
                .update({
                    is_active: data.is_active,
                    is_preferred: data.is_preferred,
                    updated_at: trx.raw("SYSUTCDATETIME()"),
                    updated_by: data.updated_by,
                });

            return trx<ProductSupplier>("purchasing.product_suppliers")
                .where({
                    product_id: productId,
                    supplier_id: supplierId,
                })
                .first() as Promise<ProductSupplier>;
        });
    }
}
