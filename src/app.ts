import express, { Application, Request, Response } from "express";
import cors from "cors";
import { swaggerSpec, swaggerUi } from "./configurations/swagger";
import { errorHandler } from "./shared/middlewares/error-handler";
import { AppError } from "./shared/errors/app-error";
import { env } from "./configurations/env";
import { HttpStatus } from "./shared/constants/http-status";
import pinoHttp from "pino-http";
import { logger } from "./configurations/logger";
import { requestId } from "./shared/middlewares/request-id";
import { helmetMiddleware, swaggerHelmetMiddleware } from "./configurations/helmet";
import { globalRateLimiter } from "./configurations/rate-limit";
import routes from "./routes";

const app: Application = express();

// Middleware para asignar un ID único a cada solicitud
app.use(requestId);

// Logger
app.use(
    pinoHttp({
        logger,
        genReqId: (_req, res) => {
            return res.locals.requestId as string;
        },
        customLogLevel: (_req, res, err) => {
            if (err || res.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
                return "error";
            }

            if (res.statusCode >= HttpStatus.BAD_REQUEST) {
                return "warn";
            }

            return "info";
        },

        serializers: {
            req: (req) => ({
                id: req.id,
                method: req.method,
                url: req.url,
            }),

            res: (res) => ({
                statusCode: res.statusCode,
            }),
        },
    }),
);

// Middlewares
// Helmet exclusivo para Swagger
// Swagger únicamente en desarrollo
if (env.NODE_ENV === "development") {
    app.use("/api/docs", swaggerHelmetMiddleware, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Helmet para el resto de la API
app.use(helmetMiddleware);

// Rate Limiting global
app.use(globalRateLimiter);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api", routes);

// Swagger UI
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req: Request, res: Response) => {
    res.status(HttpStatus.OK).json({
        success: true,
        message: `Bienvenido a la API de ${env.APP_NAME}`,
        documentation: `${env.URL_SERVER}/api/docs`,
    });
});

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: Verificar el estado del servidor
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Servidor funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: API funcionando correctamente
 */

// Ruta de health check
app.get("/api/health", (req: Request, res: Response) => {
    res.status(HttpStatus.OK).json({
        success: true,
        message: "Backend funcionando correctamente",
    });
});

app.use((req, _res, next) => {
    next(new AppError(HttpStatus.NOT_FOUND, "Ruta no encontrada"));
});

// Global Error Handler
app.use(errorHandler);

export default app;
