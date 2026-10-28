import argon2 from "argon2";

const PASSWORD_CONFIG = {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
} as const;

export class Password {
    static async hash(password: string): Promise<string> {
        return argon2.hash(password, PASSWORD_CONFIG);
    }

    static async verify(passwordHash: string, password: string): Promise<boolean> {
        return argon2.verify(passwordHash, password);
    }
}
