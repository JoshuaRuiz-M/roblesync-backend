import { BaseService } from "../../../shared/services/base.service";
import { ProductsRepository } from "./products.repository";

import type {
    CreateProductSupplier,
    Product,
    ProductSupplier,
    ProductSupplierDetail,
    UpdateProductSupplier,
} from "./products.types";

import type { CreateProductsInput, UpdateProductsInput } from "./products.schema";
import { AppError } from "../../../shared/errors/app-error";
import { HttpStatus } from "../../../shared/constants/http-status";

export class ProductsService extends BaseService<
    Product,
    CreateProductsInput,
    UpdateProductsInput
> {
    constructor(private readonly productsRepository: ProductsRepository) {
        super(productsRepository, "Producto");
    }

    async findSuppliers(productId: number): Promise<ProductSupplierDetail[]> {
        await this.findById(productId);

        return this.productsRepository.getSuppliers(productId);
    }

    async addSupplier(
        productId: number,
        data: CreateProductSupplier,
        userId: number,
    ): Promise<ProductSupplier> {
        await this.findById(productId);

        const supplier = await this.productsRepository.findSupplierById(data.supplier_id);

        if (!supplier) {
            throw new AppError(HttpStatus.NOT_FOUND, "El proveedor no existe.");
        }

        if (!supplier.is_active) {
            throw new AppError(
                HttpStatus.BAD_REQUEST,
                "No se puede asociar un proveedor inactivo.",
            );
        }

        const existing = await this.productsRepository.findProductSupplier(
            productId,
            data.supplier_id,
        );

        if (existing?.is_active) {
            throw new AppError(
                HttpStatus.CONFLICT,
                "El proveedor ya está asociado a este producto.",
            );
        }

        return this.productsRepository.saveProductSupplier(productId, data, userId);
    }

    async updateSupplier(
        productId: number,
        supplierId: number,
        data: UpdateProductSupplier,
        userId: number,
    ): Promise<ProductSupplier> {
        await this.findById(productId);

        const existing = await this.productsRepository.findProductSupplier(productId, supplierId);

        if (!existing) {
            throw new AppError(
                HttpStatus.NOT_FOUND,
                "El proveedor no está asociado a este producto.",
            );
        }

        const isActive = data.is_active ?? existing.is_active;
        const isPreferred = isActive && (data.is_preferred ?? existing.is_preferred);

        if (isPreferred) {
            const supplier = await this.productsRepository.findSupplierById(supplierId);

            if (!supplier?.is_active) {
                throw new AppError(
                    HttpStatus.BAD_REQUEST,
                    "No se puede establecer un proveedor inactivo como preferido.",
                );
            }
        }

        return this.productsRepository.updateProductSupplier(productId, supplierId, {
            is_active: isActive,
            is_preferred: isPreferred,
            updated_by: userId,
        });
    }

    async setPreferredSupplier(
        productId: number,
        supplierId: number,
        userId: number,
    ): Promise<ProductSupplier> {
        await this.findById(productId);

        const existing = await this.productsRepository.findProductSupplier(productId, supplierId);

        if (!existing || !existing.is_active) {
            throw new AppError(
                HttpStatus.BAD_REQUEST,
                "El proveedor no tiene una asociación activa con este producto.",
            );
        }

        return this.updateSupplier(productId, supplierId, { is_preferred: true }, userId);
    }

    async removeSupplier(
        productId: number,
        supplierId: number,
        userId: number,
    ): Promise<ProductSupplier> {
        return this.updateSupplier(
            productId,
            supplierId,
            {
                is_active: false,
                is_preferred: false,
            },
            userId,
        );
    }
}
