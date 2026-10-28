import knex, { type Knex } from "knex";

import { env } from "./env";

const databaseConfig: Knex.Config = {
    client: env.DB_CLIENT,

    connection: {
        host: env.DB_HOST,
        port: env.DB_PORT,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,

        options: {
            encrypt: false,
            trustServerCertificate: true,
        },
    },

    pool: {
        min: 0,
        max: 10,
    },

    acquireConnectionTimeout: 10000,
};

export const db: Knex = knex(databaseConfig);

export const checkDatabaseConnection = async (): Promise<boolean> => {
    try {
        await db.raw("SELECT 1");
        return true;
    } catch {
        return false;
    }
};

export const closeDatabaseConnection = async (): Promise<void> => {
    await db.destroy();
};
