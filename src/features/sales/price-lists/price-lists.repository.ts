import type { Knex } from "knex";

import { createPriceListSchema, updatePriceListSchema } from "./price-lists.schema";

import type {
    PriceList,
    PriceListDetail,
    CreatePriceList,
    UpdatePriceList,
    CreatePriceListDetail,
} from "./price-lists.types";

import { BaseRepository } from "../../../shared/repositories/base.repository";
import { AppError } from "../../../shared/errors/app-error";
import { HttpStatus } from "../../../shared/constants/http-status";

export class PriceListsRepository extends BaseRepository<
    PriceList,
    CreatePriceList,
    UpdatePriceList
> {
    constructor() {
        super({
            schema: "sales",
            table: "price_lists",
            primaryKey: "price_list_id",
            columns: [
                "price_list_id",
                "code",
                "name",
                "description",
                "is_active",
                "created_at",
                "created_by",
                "updated_at",
                "updated_by",
            ],
            hasAuditFields: true,
            hasUserFields: true,
            schemas: {
                create: createPriceListSchema,
                update: updatePriceListSchema,
            },
        });
    }

    async findDetails(priceListId: number): Promise<PriceListDetail[]> {
        return this.db("sales.price_list_details")
            .where("price_list_id", priceListId)
            .select(
                "price_list_detail_id",
                "price_list_id",
                "product_id",
                "unit_price",
                "created_at",
                "created_by",
                "updated_at",
                "updated_by",
            )
            .orderBy("price_list_detail_id", "asc");
    }

    override async create(data: CreatePriceList, user_id: number): Promise<PriceList> {
        const validated = createPriceListSchema.parse(data);

        const id = await this.db.transaction(async (trx) => {
            await this.validateProducts(trx, validated.details);

            const [created] = await trx("sales.price_lists")
                .insert({
                    code: validated.code,
                    name: validated.name,
                    description: validated.description ?? null,
                    is_active: validated.is_active,
                    created_at: trx.raw("SYSUTCDATETIME()"),
                    created_by: user_id,
                })
                .returning("price_list_id");

            const priceListId = Number(created.price_list_id);

            await trx("sales.price_list_details").insert(
                validated.details.map((detail) => ({
                    price_list_id: priceListId,
                    product_id: detail.product_id,
                    unit_price: detail.unit_price,
                    created_at: trx.raw("SYSUTCDATETIME()"),
                    created_by: user_id,
                })),
            );

            return priceListId;
        });

        const entity = await this.findById(id);

        if (!entity) {
            throw new Error("Created price list could not be retrieved");
        }

        return entity;
    }

    override async update(
        id: number,
        data: UpdatePriceList,
        user_id: number,
    ): Promise<PriceList | null> {
        const validated = updatePriceListSchema.parse(data);

        const updated = await this.db.transaction(async (trx) => {
            const priceList = await trx("sales.price_lists")
                .where("price_list_id", id)
                .forUpdate()
                .first();

            if (!priceList) {
                return false;
            }

            if (validated.details !== undefined) {
                await this.validateProducts(trx, validated.details);

                await trx("sales.price_list_details").where("price_list_id", id).delete();

                if (validated.details.length > 0) {
                    await trx("sales.price_list_details").insert(
                        validated.details.map((detail) => ({
                            price_list_id: id,
                            product_id: detail.product_id,
                            unit_price: detail.unit_price,
                            created_at: trx.raw("SYSUTCDATETIME()"),
                            created_by: user_id,
                        })),
                    );
                }
            }

            const headerUpdates: Record<string, unknown> = {
                updated_at: trx.raw("SYSUTCDATETIME()"),
                updated_by: user_id,
            };

            if (validated.code !== undefined) {
                headerUpdates.code = validated.code;
            }

            if (validated.name !== undefined) {
                headerUpdates.name = validated.name;
            }

            if (validated.description !== undefined) {
                headerUpdates.description = validated.description;
            }

            if (validated.is_active !== undefined) {
                headerUpdates.is_active = validated.is_active;
            }

            await trx("sales.price_lists").where("price_list_id", id).update(headerUpdates);

            return true;
        });

        return updated ? this.findById(id) : null;
    }

    private async validateProducts(
        trx: Knex.Transaction,
        details: CreatePriceListDetail[],
    ): Promise<void> {
        if (details.length === 0) {
            return;
        }

        const productIds = details.map((detail) => detail.product_id);

        const products = await trx("catalog.products")
            .whereIn("product_id", productIds)
            .select("product_id");

        const existingIds = new Set(products.map((product) => Number(product.product_id)));

        for (const productId of productIds) {
            if (!existingIds.has(productId)) {
                throw new AppError(HttpStatus.BAD_REQUEST, `El producto ${productId} no existe`);
            }
        }
    }

    override async delete(id: number): Promise<boolean> {
        return this.db.transaction(async (trx) => {
            const priceList = await trx("sales.price_lists")
                .where("price_list_id", id)
                .forUpdate()
                .first("price_list_id");

            if (!priceList) {
                return false;
            }

            await trx("sales.price_list_details").where("price_list_id", id).delete();

            await trx("sales.price_lists").where("price_list_id", id).delete();

            return true;
        });
    }
}
