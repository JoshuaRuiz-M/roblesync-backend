import { BaseRepository } from "../../shared/repositories/base.repository";

import { createRoleSchema, updateRoleSchema } from "./roles.schema";

import type { Role, CreateRole, UpdateRole, RoleMenuItem, RolePermissionItem } from "./roles.types";

export class RolesRepository extends BaseRepository<Role, CreateRole, UpdateRole> {
    constructor() {
        super({
            schema: "security",
            table: "roles",
            primaryKey: "role_id",
            columns: [
                "role_id",
                "code",
                "name",
                "description",
                "is_active",
                "created_at",
                "updated_at",
            ],
            hasAuditFields: true,
            schemas: {
                create: createRoleSchema,
                update: updateRoleSchema,
            },
        });
    }

    async findMenuItems(roleId: number): Promise<RoleMenuItem[]> {
        return this.db("navigation.role_menu_items as rmi")
            .innerJoin("navigation.menu_items as mi", "mi.menu_item_id", "rmi.menu_item_id")
            .where("rmi.role_id", roleId)
            .select(
                "mi.menu_item_id",
                "mi.parent_id",
                "mi.code",
                "mi.label",
                "mi.path",
                "mi.icon",
                "mi.sort_order",
                "mi.is_active",
            )
            .orderBy("mi.sort_order", "asc")
            .orderBy("mi.menu_item_id", "asc");
    }

    async countExistingMenuItems(menuItemIds: number[]): Promise<number> {
        if (menuItemIds.length === 0) {
            return 0;
        }

        const result = await this.db
            .table("navigation.menu_items")
            .whereIn("menu_item_id", menuItemIds)
            .count({ total: "*" })
            .first();

        return Number(result?.total ?? 0);
    }

    async syncMenuItems(roleId: number, menuItemIds: number[]): Promise<void> {
        await this.db.transaction(async (trx) => {
            await trx("navigation.role_menu_items").where("role_id", roleId).delete();

            if (menuItemIds.length === 0) {
                return;
            }

            await trx("navigation.role_menu_items").insert(
                menuItemIds.map((menuItemId) => ({
                    role_id: roleId,
                    menu_item_id: menuItemId,
                    created_at: trx.raw("SYSUTCDATETIME()"),
                })),
            );
        });
    }

    async findPermissions(roleId: number): Promise<RolePermissionItem[]> {
        return this.db("security.role_permissions as rp")
            .innerJoin("security.permissions as p", "p.permission_id", "rp.permission_id")
            .where("rp.role_id", roleId)
            .select("p.permission_id", "p.code", "p.name", "p.description", "p.is_active")
            .orderBy("p.code", "asc");
    }

    async countExistingPermissions(permissionIds: number[]): Promise<number> {
        if (permissionIds.length === 0) {
            return 0;
        }

        const result = await this.db
            .withSchema("security")
            .table("permissions")
            .whereIn("permission_id", permissionIds)
            .count({ total: "*" })
            .first();

        return Number(result?.total ?? 0);
    }

    async syncPermissions(roleId: number, permissionIds: number[]): Promise<void> {
        await this.db.transaction(async (trx) => {
            await trx("security.role_permissions").where("role_id", roleId).delete();

            if (permissionIds.length === 0) {
                return;
            }

            await trx("security.role_permissions").insert(
                permissionIds.map((permissionId) => ({
                    role_id: roleId,
                    permission_id: permissionId,
                })),
            );
        });
    }
}
