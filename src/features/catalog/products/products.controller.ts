import { Request, Response } from "express";
import { BaseController } from "../../../shared/controllers/base.controller";
import { ProductsService } from "./products.service";

import type { CreateProductSupplier, Product, UpdateProductSupplier } from "./products.types";

import type { CreateProductsInput, UpdateProductsInput } from "./products.schema";
import { ApiResponder } from "../../../shared/http/api-responder";
import { getValidated } from "../../../shared/http/validated-request";
import { AuthUser } from "../../auth/auth.types";

export class ProductsController extends BaseController<
    Product,
    CreateProductsInput,
    UpdateProductsInput
> {
    constructor(private readonly productsService: ProductsService) {
        super(productsService);
    }

    findSuppliers = async (_req: Request, res: Response): Promise<void> => {
        const productId = Number(this.getId(res));

        const suppliers = await this.productsService.findSuppliers(productId);

        ApiResponder.ok(res, suppliers);
    };

    addSupplier = async (_req: Request, res: Response): Promise<void> => {
        const { user_id } = res.locals.authUser as AuthUser;

        const productId = Number(this.getId(res));

        const data = getValidated<CreateProductSupplier>(res, "body");

        const supplier = await this.productsService.addSupplier(productId, data, user_id);

        ApiResponder.created(res, supplier, "Proveedor asociado correctamente al producto.");
    };

    updateSupplier = async (_req: Request, res: Response): Promise<void> => {
        const { user_id } = res.locals.authUser as AuthUser;

        const { id, supplierId } = getValidated<{
            id: number;
            supplierId: number;
        }>(res, "params");

        const data = getValidated<UpdateProductSupplier>(res, "body");

        const supplier = await this.productsService.updateSupplier(id, supplierId, data, user_id);

        ApiResponder.ok(res, supplier, "Proveedor del producto actualizado correctamente.");
    };

    setPreferredSupplier = async (_req: Request, res: Response): Promise<void> => {
        const { user_id } = res.locals.authUser as AuthUser;

        const { id, supplierId } = getValidated<{
            id: number;
            supplierId: number;
        }>(res, "params");

        const supplier = await this.productsService.setPreferredSupplier(id, supplierId, user_id);

        ApiResponder.ok(res, supplier, "Proveedor preferido actualizado correctamente.");
    };

    removeSupplier = async (_req: Request, res: Response): Promise<void> => {
        const { user_id } = res.locals.authUser as AuthUser;

        const { id, supplierId } = getValidated<{
            id: number;
            supplierId: number;
        }>(res, "params");

        const supplier = await this.productsService.removeSupplier(id, supplierId, user_id);

        ApiResponder.ok(res, supplier, "Proveedor desasociado correctamente del producto.");
    };
}
