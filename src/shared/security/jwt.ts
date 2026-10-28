import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { env } from "../../configurations/env";

export interface AccessTokenPayload extends JWTPayload {
    sub: string;
    username: string;
    email: string;
}

export class Jwt {
    private static readonly secret = new TextEncoder().encode(env.JWT_SECRET);

    private static readonly issuer = "backend-api";

    private static readonly audience = "backend-client";

    static async sign({ username, email }: { username: string; email: string }): Promise<string> {
        return new SignJWT({ username, email })
            .setProtectedHeader({
                alg: "HS256",
                typ: "JWT",
            })
            .setSubject(username)
            .setIssuer(this.issuer)
            .setAudience(this.audience)
            .setIssuedAt()
            .setExpirationTime(env.JWT_ACCESS_EXPIRES_IN)
            .sign(this.secret);
    }

    static async verify(token: string): Promise<AccessTokenPayload> {
        const { payload } = await jwtVerify(token, this.secret, {
            algorithms: ["HS256"],
            issuer: this.issuer,
            audience: this.audience,
            requiredClaims: ["sub", "username", "email", "iat", "exp"],
        });

        if (
            typeof payload.sub !== "string" ||
            typeof payload.username !== "string" ||
            typeof payload.email !== "string" ||
            !payload.sub.trim() ||
            !payload.username.trim() ||
            !payload.email.trim() ||
            payload.sub !== payload.username
        ) {
            throw new Error("El token contiene información inválida.");
        }

        return payload as AccessTokenPayload;
    }
}
