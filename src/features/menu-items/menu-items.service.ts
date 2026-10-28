import { BaseService } from "../../shared/services/base.service";
import { MenuItemsRepository } from "./menu-items.repository";

import type { MenuItem } from "./menu-items.types";

import type { CreateMenuItemInput, UpdateMenuItemInput } from "./menu-items.schema";
import { AppError } from "../../shared/errors/app-error";
import { HttpStatus } from "../../shared/constants/http-status";
import { RepositoryId } from "../../shared/repositories/base-repository.types";

export class MenuItemsService extends BaseService<
    MenuItem,
    CreateMenuItemInput,
    UpdateMenuItemInput
> {
    constructor(private readonly menuItemsRepository: MenuItemsRepository) {
        super(menuItemsRepository, "Opción de menú");
    }

    override async create(data: CreateMenuItemInput): Promise<MenuItem> {
        if (data.parent_id) {
            const exists = await this.menuItemsRepository.parentExists(data.parent_id);

            if (!exists) {
                throw new AppError(HttpStatus.BAD_REQUEST, "La opción de menú padre no existe.");
            }
        }

        return super.create(data);
    }

    override async update(id: RepositoryId, data: UpdateMenuItemInput): Promise<MenuItem> {
        const menuItem = await this.findById(id);

        if (data.parent_id !== undefined && data.parent_id !== null) {
            if (data.parent_id === menuItem.menu_item_id) {
                throw new AppError(
                    HttpStatus.BAD_REQUEST,
                    "Una opción de menú no puede ser su propio padre.",
                );
            }

            const exists = await this.menuItemsRepository.parentExists(data.parent_id);

            if (!exists) {
                throw new AppError(HttpStatus.BAD_REQUEST, "La opción de menú padre no existe.");
            }

            const createsCycle = await this.menuItemsRepository.wouldCreateCycle(
                menuItem.menu_item_id,
                data.parent_id,
            );

            if (createsCycle) {
                throw new AppError(
                    HttpStatus.BAD_REQUEST,
                    "La asignación del padre generaría una referencia circular.",
                );
            }
        }

        return super.update(id, data);
    }

    override async delete(id: RepositoryId): Promise<void> {
        const menuItem = await this.findById(id);

        const hasChildren = await this.menuItemsRepository.hasChildren(menuItem.menu_item_id);

        if (hasChildren) {
            throw new AppError(
                HttpStatus.CONFLICT,
                "No se puede eliminar una opción de menú que tiene elementos hijos.",
            );
        }

        const hasAssignments = await this.menuItemsRepository.hasRoleAssignments(
            menuItem.menu_item_id,
        );

        if (hasAssignments) {
            throw new AppError(
                HttpStatus.CONFLICT,
                "No se puede eliminar una opción de menú asignada a roles.",
            );
        }

        await super.delete(id);
    }
}
