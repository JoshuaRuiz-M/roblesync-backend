import swaggerJsdoc, { type Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { env } from "./env";

const options: Options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: `${env.APP_NAME} API`,
            version: "1.0.0",
            description: `Documentación de la API de ${env.APP_NAME}`,
        },
        servers: [
            {
                url: env.URL_SERVER,
                description: "Servidor actual",
            },
        ],
        components: {
            headers: {
                "X-Request-ID": {
                    description: "Identificador único de la petición HTTP",
                    schema: {
                        type: "string",
                        format: "uuid",
                    },
                },
            },
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: ["./src/**/*.ts", "./build/**/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi };
