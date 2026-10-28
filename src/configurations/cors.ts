import { CorsOptions } from "cors";
import { env } from "./env";
import { HttpStatus } from "../shared/constants/http-status";

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        // Permitir peticiones sin encabezado Origin
        if (!origin) {
            return callback(null, true);
        }

        if (env.CORS_ORIGINS.includes(origin)) {
            return callback(null, true);
        }

        return callback(null, false);
    },

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Request-ID"],

    exposedHeaders: ["X-Request-ID"],

    credentials: false,

    optionsSuccessStatus: HttpStatus.NO_CONTENT,
};
