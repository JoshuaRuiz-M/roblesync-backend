import { BaseService } from "../../shared/services/base.service";
import { AppError } from "../../shared/errors/app-error";
import { HttpStatus } from "../../shared/constants/http-status";

import { UsersRepository } from "./users.repository";

import type {
    User,
    CreateUser,
    UpdateUser,
    UserRole,
    SyncUserRoles,
    UserMenuItem,
    UserMenuItemRow,
} from "./users.types";

export class UsersService extends BaseService<User, CreateUser, UpdateUser> {
    constructor(private readonly usersRepository: UsersRepository) {
        super(usersRepository, "Usuario");
    }

    async findRoles(userId: number): Promise<UserRole[]> {
        await this.findById(userId);

        return this.usersRepository.findRoles(userId);
    }

    async syncRoles(userId: number, data: SyncUserRoles): Promise<UserRole[]> {
        await this.findById(userId);

        const existingRoles = await this.usersRepository.countExistingRoles(data.role_ids);

        if (existingRoles !== data.role_ids.length) {
            throw new AppError(HttpStatus.BAD_REQUEST, "Uno o más roles no existen.");
        }

        await this.usersRepository.syncRoles(userId, data.role_ids);

        return this.usersRepository.findRoles(userId);
    }

    async findMenuItems(userId: number): Promise<UserMenuItem[]> {
        await this.findById(userId);

        const rows = await this.usersRepository.findMenuItems(userId);

        return this.buildMenuTree(rows);
    }

    private buildMenuTree(rows: UserMenuItemRow[]): UserMenuItem[] {
        const nodes = new Map<number, UserMenuItem>();
        const roots: UserMenuItem[] = [];

        for (const row of rows) {
            const node: UserMenuItem = {
                id: row.menu_item_id,
                label: row.label,
            };

            if (row.icon) {
                node.icon = row.icon;
            }

            if (row.path) {
                node.routerLink = row.path;
            }

            nodes.set(row.menu_item_id, node);
        }

        for (const row of rows) {
            const node = nodes.get(row.menu_item_id)!;

            if (row.parent_id === null || !nodes.has(row.parent_id)) {
                roots.push(node);
                continue;
            }

            const parent = nodes.get(row.parent_id)!;

            parent.items ??= [];
            parent.items.push(node);
        }

        return roots;
    }
}
