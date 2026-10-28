import type { Knex } from "knex";

import { db } from "../../configurations/database";

import {
    createPaginationMeta,
    type PaginatedResult,
    type PaginationParams,
} from "../http/pagination";

import type { RepositoryConfig, RepositoryId } from "./base-repository.types";

export abstract class BaseRepository<
    TEntity extends object,
    TCreate extends object,
    TUpdate extends object,
> {
    protected readonly db: Knex;

    protected readonly config: RepositoryConfig<TEntity, TCreate, TUpdate>;

    constructor(config: RepositoryConfig<TEntity, TCreate, TUpdate>) {
        this.db = db;
        this.config = config;
    }

    protected query(): Knex.QueryBuilder {
        return this.db.withSchema(this.config.schema).table(this.config.table);
    }

    async count(): Promise<number> {
        const result = await this.query().count({ total: "*" }).first();

        return Number(result?.total ?? 0);
    }

    async findAll(params: PaginationParams): Promise<PaginatedResult<TEntity>> {
        const { page, limit } = params;

        if (
            !Number.isSafeInteger(page) ||
            page < 1 ||
            !Number.isSafeInteger(limit) ||
            limit < 1 ||
            limit > 100
        ) {
            throw new RangeError("Invalid pagination parameters");
        }

        const offset = (page - 1) * limit;

        if (!Number.isSafeInteger(offset)) {
            throw new RangeError("Pagination offset is too large");
        }

        const [total, data] = await Promise.all([
            this.count(),

            this.query()
                .select([...this.config.columns])
                .orderBy(this.config.primaryKey, "asc")
                .limit(limit)
                .offset(offset) as Promise<TEntity[]>,
        ]);

        return {
            data,
            meta: createPaginationMeta(params, total),
        };
    }

    async findById(id: RepositoryId): Promise<TEntity | null> {
        const result = await this.query()
            .select([...this.config.columns])
            .where(this.config.primaryKey, id)
            .first();

        return (result as TEntity | undefined) ?? null;
    }

    async create(data: TCreate): Promise<TEntity> {
        const validated = this.config.schemas.create.parse(data);

        const dataToInsert = this.config.hasAuditFields
            ? {
                  ...validated,
                  created_at: this.db.raw("SYSUTCDATETIME()"),
              }
            : validated;

        const [created] = await this.query().insert(dataToInsert).returning(this.config.primaryKey);

        const id = created[this.config.primaryKey];

        const entity = await this.findById(id);

        if (!entity) {
            throw new Error("Created record could not be retrieved");
        }

        return entity;
    }

    async update(id: RepositoryId, data: TUpdate): Promise<TEntity | null> {
        const validated = this.config.schemas.update.parse(data);

        if (Object.keys(validated).length === 0) {
            throw new Error("Update requires at least one field");
        }

        const dataToUpdate = this.config.hasAuditFields
            ? {
                  ...validated,
                  updated_at: this.db.raw("SYSUTCDATETIME()"),
              }
            : validated;

        const affectedRows = await this.query()
            .where(this.config.primaryKey, id)
            .update(dataToUpdate);

        if (affectedRows === 0) {
            return null;
        }

        return this.findById(id);
    }

    async delete(id: RepositoryId): Promise<boolean> {
        const affectedRows = await this.query().where(this.config.primaryKey, id).delete();

        return affectedRows > 0;
    }
}
