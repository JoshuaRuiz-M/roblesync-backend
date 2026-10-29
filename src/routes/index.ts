import { Router } from "express";
import authRoutes from "../features/auth/auth.routes";
import rolesRoutes from "../features/roles/roles.routes";
import menuItemsRoutes from "../features/menu-items/menu-items.routes";
import usersRoutes from "../features/users/users.routes";
import permissionsRoutes from "../features/permissions/permissions.routes";
import brandsRoutes from "../features/catalog/brands/brands.routes";
import categoriesRoutes from "../features/catalog/categories/categories.routes";
import productLinesRoutes from "../features/catalog/product-lines/product-lines.routes";
import suppliersRoutes from "../features/purchasing/suppliers/suppliers.routes";

const router = Router();

// Feature routes
router.use("/auth", authRoutes);
router.use("/roles", rolesRoutes);
router.use("/menu-items", menuItemsRoutes);
router.use("/users", usersRoutes);
router.use("/permissions", permissionsRoutes);
router.use("/brands", brandsRoutes);
router.use("/categories", categoriesRoutes);
router.use("/product-lines", productLinesRoutes);
router.use("/suppliers", suppliersRoutes);

export default router;
