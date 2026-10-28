import { AuthRepository } from "./auth.repository";
import { Password } from "../../shared/security/password";
import { Jwt } from "../../shared/security/jwt";
import { AppError } from "../../shared/errors/app-error";
import { HttpStatus } from "../../shared/constants/http-status";

import type { AuthProfile, AuthUser, LoginResult } from "./auth.types";

import type { ChangePasswordInput, LoginInput } from "./auth.schema";
import { UserMenuItem } from "../users/users.types";
import { UsersService } from "../users/users.service";

export class AuthService {
    constructor(
        private readonly repository: AuthRepository,
        private readonly usersService: UsersService,
    ) {}

    private async buildProfile(user: AuthUser): Promise<AuthProfile> {
        const [roles, permissions] = await Promise.all([
            this.repository.findRoleCodes(user.user_id),
            this.repository.findPermissionCodes(user.user_id),
        ]);

        return {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            roles,
            permissions,
        };
    }

    async login(credentials: LoginInput): Promise<LoginResult> {
        const user = await this.repository.findByUsername(credentials.username);

        if (!user || !user.is_active) {
            throw new AppError(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas.");
        }

        const validPassword = await Password.verify(user.password_hash, credentials.password);

        if (!validPassword) {
            throw new AppError(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas.");
        }

        const profile = await this.buildProfile(user);

        const accessToken = await Jwt.sign({
            username: user.username,
            email: user.email,
        });

        return {
            access_token: accessToken,
            token_type: "Bearer",
            user: profile,
        };
    }

    async changePassword(username: string, data: ChangePasswordInput): Promise<void> {
        const user = await this.repository.findActiveWithPasswordByUsername(username);

        if (!user) {
            throw new AppError(
                HttpStatus.UNAUTHORIZED,
                "El usuario no existe o se encuentra inactivo.",
            );
        }

        const isCurrentPasswordValid = await Password.verify(
            user.password_hash,
            data.current_password,
        );

        if (!isCurrentPasswordValid) {
            throw new AppError(HttpStatus.BAD_REQUEST, "La contraseña actual es incorrecta.");
        }

        const isSamePassword = await Password.verify(user.password_hash, data.new_password);

        if (isSamePassword) {
            throw new AppError(
                HttpStatus.BAD_REQUEST,
                "La nueva contraseña debe ser diferente de la actual.",
            );
        }

        const newPasswordHash = await Password.hash(data.new_password);

        const updated = await this.repository.updatePassword(
            user.user_id,
            user.password_hash,
            newPasswordHash,
        );

        if (!updated) {
            throw new AppError(
                HttpStatus.CONFLICT,
                "No se pudo actualizar la contraseña. Intente nuevamente.",
            );
        }
    }

    async getProfile(username: string): Promise<AuthProfile> {
        const user = await this.repository.findActiveByUsername(username);

        if (!user) {
            throw new AppError(HttpStatus.UNAUTHORIZED, "El usuario no está disponible.");
        }

        return this.buildProfile(user);
    }

    async getMenu(username: string): Promise<UserMenuItem[]> {
        const user = await this.repository.findActiveByUsername(username);

        if (!user) {
            throw new AppError(
                HttpStatus.UNAUTHORIZED,
                "El usuario no existe o se encuentra inactivo.",
            );
        }

        return this.usersService.findMenuItems(user.user_id);
    }

    async hasPermission(userId: number, permission: string): Promise<boolean> {
        const permissions = await this.repository.findPermissionCodes(userId);

        return permissions.includes(permission);
    }
}
