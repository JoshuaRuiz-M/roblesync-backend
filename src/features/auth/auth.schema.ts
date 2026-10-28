import { z } from "zod";
import { passwordSchema } from "../users/users.schema";

export const loginSchema = z.strictObject({
    username: z
        .string()
        .trim()
        .min(1, "El nombre de usuario es obligatorio.")
        .max(50, "El nombre de usuario no puede superar los 50 caracteres."),

    password: z.string().min(1, "La contraseña es obligatoria."),
});

export const changePasswordSchema = z.strictObject({
    current_password: z.string().min(1, "La contraseña actual es obligatoria."),

    new_password: passwordSchema,
});

export type ChangePasswordInput = z.output<typeof changePasswordSchema>;

export type LoginInput = z.output<typeof loginSchema>;
