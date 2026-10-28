import { HttpStatus } from "../constants/http-status";

export class AppError extends Error {
    constructor(
        public readonly statusCode: HttpStatus,
        message: string,
        public readonly type: string = "about:blank",
    ) {
        super(message);

        this.name = "AppError";

        Object.setPrototypeOf(this, new.target.prototype);
    }
}
