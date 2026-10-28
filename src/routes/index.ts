import { Router } from "express";
import authRoutes from "../features/auth/auth.routes";
import rolesRoutes from "../features/roles/roles.routes";
import menuItemsRoutes from "../features/menu-items/menu-items.routes";
import usersRoutes from "../features/users/users.routes";
import permissionsRoutes from "../features/permissions/permissions.routes";

const router = Router();

// Feature routes
router.use("/auth", authRoutes);
router.use("/roles", rolesRoutes);
router.use("/menu-items", menuItemsRoutes);
router.use("/users", usersRoutes);
router.use("/permissions", permissionsRoutes);

export default router;
