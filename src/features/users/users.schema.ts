import { z } from "zod";

export const passwordSchema = z
    .string()
    .min(12, "La contraseña debe tener al menos 12 caracteres.")
    .max(128, "La contraseña no puede superar los 128 caracteres.")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula.")
    .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula.")
    .regex(/[0-9]/, "La contraseña debe contener al menos un número.")
    .regex(/[^A-Za-z0-9]/, "La contraseña debe contener al menos un carácter especial.");

export const createUserSchema = z.strictObject({
    username: z
        .string()
        .trim()
        .min(3, "El usuario debe tener al menos 3 caracteres.")
        .max(50, "El usuario no puede superar los 50 caracteres."),

    email: z
        .email("El correo electrónico no es válido.")
        .max(255, "El correo no puede superar los 255 caracteres."),

    password: passwordSchema,

    first_name: z
        .string()
        .trim()
        .min(1, "El nombre es obligatorio.")
        .max(100, "El nombre no puede superar los 100 caracteres."),

    last_name: z
        .string()
        .trim()
        .min(1, "El apellido es obligatorio.")
        .max(100, "El apellido no puede superar los 100 caracteres."),

    is_active: z.boolean().default(true),
});

export const updateUserSchema = createUserSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        "Debe proporcionar al menos un campo para actualizar.",
    );

export const syncUserRolesSchema = z.strictObject({
    role_ids: z
        .array(z.number().int().positive())
        .refine((ids) => new Set(ids).size === ids.length, "No se permiten roles duplicados."),
});

export type CreateUserInput = z.output<typeof createUserSchema>;
export type UpdateUserInput = z.output<typeof updateUserSchema>;
