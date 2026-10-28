import { db } from "../../configurations/database";

import type { AuthUser, AuthUserRecord } from "./auth.types";

export class AuthRepository {
    async findByUsername(username: string): Promise<AuthUserRecord | null> {
        const user = await db
            .table("security.users")
            .select(
                "user_id",
                "username",
                "email",
                "password_hash",
                "first_name",
                "last_name",
                "is_active",
            )
            .where("username", username)
            .first<AuthUserRecord>();

        return user ?? null;
    }

    async findActiveByUsername(username: string): Promise<AuthUser | null> {
        const user = await db
            .table("security.users")
            .select("user_id", "username", "email", "first_name", "last_name", "is_active")
            .where({
                username,
                is_active: true,
            })
            .first<AuthUser>();

        return user ?? null;
    }

    async findRoleCodes(userId: number): Promise<string[]> {
        const rows = await db
            .table("security.user_roles as ur")
            .join("security.roles as r", "r.role_id", "ur.role_id")
            .where("ur.user_id", userId)
            .where("r.is_active", true)
            .distinct("r.code");

        return rows.map((row: { code: string }) => row.code);
    }

    async findPermissionCodes(userId: number): Promise<string[]> {
        const rows = await db
            .table("security.user_roles as ur")
            .join("security.roles as r", "r.role_id", "ur.role_id")
            .join("security.role_permissions as rp", "rp.role_id", "r.role_id")
            .join("security.permissions as p", "p.permission_id", "rp.permission_id")
            .where("ur.user_id", userId)
            .where("r.is_active", true)
            .where("p.is_active", true)
            .distinct("p.code");

        return rows.map((row: { code: string }) => row.code);
    }

    async updatePassword(
        userId: number,
        currentPasswordHash: string,
        newPasswordHash: string,
    ): Promise<boolean> {
        const affectedRows = await db
            .table("security.users")
            .where({
                user_id: userId,
                password_hash: currentPasswordHash,
                is_active: true,
            })
            .update({
                password_hash: newPasswordHash,
                updated_at: db.raw("SYSUTCDATETIME()"),
            });

        return affectedRows > 0;
    }

    async findActiveWithPasswordByUsername(
        username: string,
    ): Promise<(AuthUser & { password_hash: string }) | null> {
        const user = await db
            .table("security.users")
            .select(
                "user_id",
                "username",
                "email",
                "first_name",
                "last_name",
                "is_active",
                "password_hash",
            )
            .where({
                username,
                is_active: true,
            })
            .first<AuthUser & { password_hash: string }>();

        return user ?? null;
    }
}
