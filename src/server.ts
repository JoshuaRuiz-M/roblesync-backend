import app from "./app";
import { env } from "./configurations/env";
import { logger } from "./configurations/logger";

const PORT = env.PORT;

app.listen(PORT, () => {
    logger.info(`Servidor ejecutándose en ${env.URL_SERVER}:${PORT}`);
});
