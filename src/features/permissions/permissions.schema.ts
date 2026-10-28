import { z } from "zod";

export const createPermissionSchema = z.strictObject({
    code: z
        .string()
        .trim()
        .min(1)
        .max(150)
        .regex(
            /^[A-Z][A-Z0-9_]*$/,
            "El código debe contener letras mayúsculas, números o guiones bajos.",
        ),

    name: z.string().trim().min(1).max(150),

    description: z.string().trim().max(500).nullable().optional(),

    is_active: z.boolean().default(true),
});

export const updatePermissionSchema = createPermissionSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        "Debe proporcionar al menos un campo para actualizar.",
    );

export type CreatePermissionInput = z.output<typeof createPermissionSchema>;
export type UpdatePermissionInput = z.output<typeof updatePermissionSchema>;
