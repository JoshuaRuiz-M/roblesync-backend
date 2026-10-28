export interface AuthUser {
    user_id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
}

export interface AuthUserRecord extends AuthUser {
    password_hash: string;
}

export interface AuthPermission {
    code: string;
}

export interface AuthProfile extends Omit<AuthUser, "is_active"> {
    roles: string[];
    permissions: string[];
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginResult {
    access_token: string;
    token_type: "Bearer";
    user: AuthProfile;
}
