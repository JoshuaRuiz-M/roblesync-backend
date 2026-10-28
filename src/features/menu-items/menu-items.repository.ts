import { BaseRepository } from "../../shared/repositories/base.repository";

import { createMenuItemSchema, updateMenuItemSchema } from "./menu-items.schema";

import type { MenuItem } from "./menu-items.types";

import type { CreateMenuItemInput, UpdateMenuItemInput } from "./menu-items.schema";

export class MenuItemsRepository extends BaseRepository<
    MenuItem,
    CreateMenuItemInput,
    UpdateMenuItemInput
> {
    constructor() {
        super({
            schema: "navigation",
            table: "menu_items",
            primaryKey: "menu_item_id",
            columns: [
                "menu_item_id",
                "parent_id",
                "code",
                "label",
                "path",
                "icon",
                "sort_order",
                "is_active",
                "created_at",
                "updated_at",
            ],
            hasAuditFields: true,
            schemas: {
                create: createMenuItemSchema,
                update: updateMenuItemSchema,
            },
        });
    }

    async parentExists(parentId: number): Promise<boolean> {
        const parent = await this.findById(parentId);

        return parent !== null;
    }

    async hasChildren(menuItemId: number): Promise<boolean> {
        const child = await this.query().where("parent_id", menuItemId).first("menu_item_id");

        return child !== undefined;
    }

    async hasRoleAssignments(menuItemId: number): Promise<boolean> {
        const assignment = await this.db
            .withSchema("navigation")
            .table("role_menu_items")
            .where("menu_item_id", menuItemId)
            .first("menu_item_id");

        return assignment !== undefined;
    }

    async wouldCreateCycle(menuItemId: number, parentId: number): Promise<boolean> {
        const visited = new Set<number>();
        let currentId: number | null = parentId;

        while (currentId !== null) {
            if (currentId === menuItemId) {
                return true;
            }

            if (visited.has(currentId)) {
                return true;
            }

            visited.add(currentId);

            const current = await this.findById(currentId);

            if (!current) {
                return false;
            }

            currentId = current.parent_id;
        }

        return false;
    }
}
