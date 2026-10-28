import pino from "pino";
import { env } from "./env";

const isDevelopment = env.NODE_ENV === "development";

export const logger = pino({
    level: env.LOG_LEVEL,

    base: {
        application: env.APP_NAME,
        environment: env.NODE_ENV,
    },

    timestamp: pino.stdTimeFunctions.isoTime,

    redact: {
        paths: [
            "req.headers.authorization",
            "req.headers.cookie",
            "password",
            "token",
            "accessToken",
            "refreshToken",
        ],
        censor: "[REDACTED]",
    },

    transport: isDevelopment
        ? {
              target: "pino-pretty",
              options: {
                  colorize: true,
                  translateTime: "SYS:standard",
                  ignore: "pid,hostname",
                  singleLine: true,
              },
          }
        : undefined,
});
