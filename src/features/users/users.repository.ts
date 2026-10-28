import { BaseRepository } from "../../shared/repositories/base.repository";

import { createUserSchema, updateUserSchema } from "./users.schema";

import type { User, CreateUser, UpdateUser, UserRole, UserMenuItemRow } from "./users.types";

import type { RepositoryId } from "../../shared/repositories/base-repository.types";

import { Password } from "../../shared/security/password";

export class UsersRepository extends BaseRepository<User, CreateUser, UpdateUser> {
    constructor() {
        super({
            schema: "security",
            table: "users",
            primaryKey: "user_id",
            columns: [
                "user_id",
                "username",
                "email",
                "first_name",
                "last_name",
                "is_active",
                "created_at",
                "updated_at",
            ],
            hasAuditFields: true,
            schemas: {
                create: createUserSchema,
                update: updateUserSchema,
            },
        });
    }

    override async create(data: CreateUser): Promise<User> {
        const validated = createUserSchema.parse(data);

        const { password, ...userData } = validated;

        const passwordHash = await Password.hash(password);

        const [created] = await this.query()
            .insert({
                ...userData,
                password_hash: passwordHash,
                created_at: this.db.raw("SYSUTCDATETIME()"),
            })
            .returning("user_id");

        const user = await this.findById(created.user_id);

        if (!user) {
            throw new Error("No se pudo recuperar el usuario creado.");
        }

        return user;
    }

    override async update(id: RepositoryId, data: UpdateUser): Promise<User | null> {
        const validated = updateUserSchema.parse(data);

        const { password, ...userData } = validated;

        const dataToUpdate: Record<string, unknown> = {
            ...userData,
            updated_at: this.db.raw("SYSUTCDATETIME()"),
        };

        if (password !== undefined) {
            dataToUpdate.password_hash = await Password.hash(password);
        }

        const affectedRows = await this.query().where("user_id", id).update(dataToUpdate);

        if (affectedRows === 0) {
            return null;
        }

        return this.findById(id);
    }

    async findRoles(userId: number): Promise<UserRole[]> {
        return this.db("security.user_roles as ur")
            .innerJoin("security.roles as r", "r.role_id", "ur.role_id")
            .where("ur.user_id", userId)
            .select("r.role_id", "r.code", "r.name", "r.description", "r.is_active")
            .orderBy("r.name", "asc");
    }

    async countExistingRoles(roleIds: number[]): Promise<number> {
        if (roleIds.length === 0) {
            return 0;
        }

        const result = await this.db
            .table("security.roles")
            .whereIn("role_id", roleIds)
            .count({ total: "*" })
            .first();

        return Number(result?.total ?? 0);
    }

    async syncRoles(userId: number, roleIds: number[]): Promise<void> {
        await this.db.transaction(async (trx) => {
            await trx("security.user_roles").where("user_id", userId).delete();

            if (roleIds.length === 0) {
                return;
            }

            await trx("security.user_roles").insert(
                roleIds.map((roleId) => ({
                    user_id: userId,
                    role_id: roleId,
                })),
            );
        });
    }

    async findMenuItems(userId: number): Promise<UserMenuItemRow[]> {
        return this.db("security.user_roles as ur")
            .innerJoin("security.roles as r", "r.role_id", "ur.role_id")
            .innerJoin("navigation.role_menu_items as rmi", "rmi.role_id", "r.role_id")
            .innerJoin("navigation.menu_items as mi", "mi.menu_item_id", "rmi.menu_item_id")
            .where("ur.user_id", userId)
            .where("r.is_active", true)
            .where("mi.is_active", true)
            .distinct(
                "mi.menu_item_id",
                "mi.parent_id",
                "mi.code",
                "mi.label",
                "mi.path",
                "mi.icon",
                "mi.sort_order",
            )
            .orderBy("mi.sort_order", "asc")
            .orderBy("mi.menu_item_id", "asc");
    }
}
