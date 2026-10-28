import { z } from "zod";

export const createRoleSchema = z.strictObject({
    code: z
        .string()
        .trim()
        .min(1, "El código del rol es obligatorio.")
        .max(100, "El código no puede superar los 100 caracteres.")
        .regex(
            /^[A-Z][A-Z0-9_]*$/,
            "El código debe utilizar letras mayúsculas, números y guiones bajos.",
        ),

    name: z
        .string()
        .trim()
        .min(1, "El nombre del rol es obligatorio.")
        .max(150, "El nombre no puede superar los 150 caracteres."),

    description: z
        .string()
        .trim()
        .max(500, "La descripción no puede superar los 500 caracteres.")
        .nullable()
        .optional(),

    is_active: z.boolean().default(true),
});

export const updateRoleSchema = createRoleSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        "Debe proporcionar al menos un campo para actualizar.",
    );

export const syncRoleMenuItemsSchema = z.strictObject({
    menu_item_ids: z
        .array(z.number().int().positive())
        .refine(
            (ids) => new Set(ids).size === ids.length,
            "No se permiten opciones de menú duplicadas.",
        ),
});

export const syncRolePermissionsSchema = z.strictObject({
    permission_ids: z
        .array(z.number().int().positive())
        .refine((ids) => new Set(ids).size === ids.length, "No se permiten permisos duplicados."),
});

export type CreateRoleInput = z.output<typeof createRoleSchema>;
export type UpdateRoleInput = z.output<typeof updateRoleSchema>;
