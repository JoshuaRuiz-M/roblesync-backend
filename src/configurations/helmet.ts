import helmet from "helmet";

export const helmetMiddleware = helmet();

export const swaggerHelmetMiddleware = helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            "script-src": ["'self'", "'unsafe-inline'"],
            "style-src": ["'self'", "'unsafe-inline'"],
            "img-src": ["'self'", "data:"],
        },
    },
});
