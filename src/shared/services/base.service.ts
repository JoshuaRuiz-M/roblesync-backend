import { BaseRepository } from "../repositories/base.repository";

import type { RepositoryId } from "../repositories/base-repository.types";

import type { PaginatedResult, PaginationParams } from "../http/pagination";

import { HttpStatus } from "../constants/http-status";
import { AppError } from "../errors/app-error";

export abstract class BaseService<
    TEntity extends object,
    TCreate extends object,
    TUpdate extends object,
> {
    constructor(
        protected readonly repository: BaseRepository<TEntity, TCreate, TUpdate>,
        protected readonly resourceName: string,
    ) {}

    async findAll(params: PaginationParams): Promise<PaginatedResult<TEntity>> {
        return this.repository.findAll(params);
    }

    async findById(id: RepositoryId): Promise<TEntity> {
        const entity = await this.repository.findById(id);

        if (entity === null) {
            throw this.notFound(id);
        }

        return entity;
    }

    async count(): Promise<number> {
        return this.repository.count();
    }

    async create(data: TCreate): Promise<TEntity> {
        return this.repository.create(data);
    }

    async update(id: RepositoryId, data: TUpdate): Promise<TEntity> {
        const entity = await this.repository.update(id, data);

        if (entity === null) {
            throw this.notFound(id);
        }

        return entity;
    }

    async delete(id: RepositoryId): Promise<void> {
        const deleted = await this.repository.delete(id);

        if (!deleted) {
            throw this.notFound(id);
        }
    }

    private notFound(id: RepositoryId): AppError {
        return new AppError(
            HttpStatus.NOT_FOUND,
            `${this.resourceName} with ID ${id} was not found`,
        );
    }
}
