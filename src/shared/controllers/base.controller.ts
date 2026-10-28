import type { Request, Response } from "express";

import { BaseService } from "../services/base.service";
import { ApiResponder } from "../http/api-responder";
import { getValidated } from "../http/validated-request";

import type { PaginationParams } from "../http/pagination";
import type { RepositoryId } from "../repositories/base-repository.types";

export abstract class BaseController<
    TEntity extends object,
    TCreate extends object,
    TUpdate extends object,
> {
    constructor(protected readonly service: BaseService<TEntity, TCreate, TUpdate>) {}

    protected getId(res: Response): RepositoryId {
        const params = getValidated<{
            id: RepositoryId;
        }>(res, "params");

        return params.id;
    }

    findAll = async (_req: Request, res: Response): Promise<void> => {
        const params = getValidated<PaginationParams>(res, "query");

        const result = await this.service.findAll(params);

        ApiResponder.paginated(res, result);
    };

    findById = async (_req: Request, res: Response): Promise<void> => {
        const id = this.getId(res);

        const entity = await this.service.findById(id);

        ApiResponder.ok(res, entity);
    };

    count = async (_req: Request, res: Response): Promise<void> => {
        const total = await this.service.count();

        ApiResponder.ok(res, { total });
    };

    create = async (_req: Request, res: Response): Promise<void> => {
        const data = getValidated<TCreate>(res, "body");

        const entity = await this.service.create(data);

        ApiResponder.created(res, entity, "Recurso creado correctamente.");
    };

    update = async (_req: Request, res: Response): Promise<void> => {
        const id = this.getId(res);

        const data = getValidated<TUpdate>(res, "body");

        const entity = await this.service.update(id, data);

        ApiResponder.ok(res, entity, "Recurso actualizado correctamente.");
    };

    delete = async (_req: Request, res: Response): Promise<void> => {
        const id = this.getId(res);

        await this.service.delete(id);

        ApiResponder.noContent(res);
    };
}
