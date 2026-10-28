export interface User {
    user_id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date | null;
}

export interface UserCredentials extends User {
    password_hash: string;
}

export interface CreateUser {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
}

export interface UpdateUser {
    username?: string;
    email?: string;
    password?: string;
    first_name?: string;
    last_name?: string;
    is_active?: boolean;
}

export interface UserRole {
    role_id: number;
    code: string;
    name: string;
    description: string | null;
    is_active: boolean;
}

export interface SyncUserRoles {
    role_ids: number[];
}

export interface UserMenuItemRow {
    menu_item_id: number;
    parent_id: number | null;
    code: string;
    label: string;
    path: string | null;
    icon: string | null;
    sort_order: number;
}

export interface UserMenuItem {
    id: number;
    label: string;
    icon?: string;
    routerLink?: string;
    items?: UserMenuItem[];
}
