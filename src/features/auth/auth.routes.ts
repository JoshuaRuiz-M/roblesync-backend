import { Router } from "express";

import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

import { changePasswordSchema, loginSchema } from "./auth.schema";

import { authenticate } from "../../shared/middlewares/authenticate";
import { validateRequest } from "../../shared/middlewares/validate-request";
import { strictRateLimiter } from "../../configurations/rate-limit";
import { UsersService } from "../users/users.service";
import { UsersRepository } from "../users/users.repository";

const router = Router();

const repository = new AuthRepository();
const usersRepository = new UsersRepository();
const usersService = new UsersService(usersRepository);
const service = new AuthService(repository, usersService);
const controller = new AuthController(service);

router.post("/login", strictRateLimiter, validateRequest({ body: loginSchema }), controller.login);

router.get("/menu", authenticate, controller.getMenu);

router.get("/me", authenticate, controller.me);

router.patch(
    "/me/password",
    authenticate,
    strictRateLimiter,
    validateRequest({ body: changePasswordSchema }),
    controller.changePassword,
);

export default router;
