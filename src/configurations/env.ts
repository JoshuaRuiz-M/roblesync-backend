import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    APP_NAME: z.string(),

    URL_SERVER: z.string().url(),

    CORS_ORIGINS: z
        .string()
        .min(1, "Debes configurar al menos un origen CORS")
        .transform((value) => value.split(",").map((origin) => origin.trim()))
        .pipe(z.array(z.url()).min(1)),

    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

    PORT: z.coerce.number().int().min(1).max(65535).default(3000),

    LOG_LEVEL: z
        .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
        .default("info"),

    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),

    RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),

    RATE_LIMIT_STRICT_WINDOW_MS: z.coerce.number().int().positive().default(900000),

    RATE_LIMIT_STRICT_MAX: z.coerce.number().int().positive().default(10),

    DB_CLIENT: z.enum(["mssql", "pg", "mysql2"]),

    DB_HOST: z.string().min(1),

    DB_PORT: z.coerce.number().int().min(1).max(65535),

    DB_USER: z.string().min(1),

    DB_PASSWORD: z.string().min(1),

    DB_NAME: z.string().min(1),

    JWT_SECRET: z.string().min(43, "JWT_SECRET debe contener al menos 43 caracteres."),

    JWT_ACCESS_EXPIRES_IN: z
        .string()
        .regex(
            /^[1-9]\d*[smhd]$/,
            "La duración del JWT debe tener un formato válido, como 15m, 1h o 7d.",
        )
        .default("15m"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success)
    throw new Error(`Variables de entorno inválidas: ${z.prettifyError(parsedEnv.error)}`);

export const env = parsedEnv.data;

export type Env = z.infer<typeof envSchema>;
