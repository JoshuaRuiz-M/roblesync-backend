import { z } from "zod";

export const createMenuItemSchema = z.strictObject({
    parent_id: z.number().int().positive().nullable().optional(),

    code: z
        .string()
        .trim()
        .min(1, "El código es obligatorio.")
        .max(100, "El código no puede superar los 100 caracteres.")
        .regex(
            /^[A-Z][A-Z0-9_]*$/,
            "El código debe contener letras mayúsculas, números o guiones bajos.",
        ),

    label: z
        .string()
        .trim()
        .min(1, "La etiqueta es obligatoria.")
        .max(150, "La etiqueta no puede superar los 150 caracteres."),

    path: z
        .string()
        .trim()
        .max(255, "La ruta no puede superar los 255 caracteres.")
        .nullable()
        .optional(),

    icon: z
        .string()
        .trim()
        .max(100, "El ícono no puede superar los 100 caracteres.")
        .nullable()
        .optional(),

    sort_order: z.number().int().min(0, "El orden no puede ser negativo."),

    is_active: z.boolean().default(true),
});

export const updateMenuItemSchema = createMenuItemSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        "Debe proporcionar al menos un campo para actualizar.",
    );

export type CreateMenuItemInput = z.output<typeof createMenuItemSchema>;
export type UpdateMenuItemInput = z.output<typeof updateMenuItemSchema>;
