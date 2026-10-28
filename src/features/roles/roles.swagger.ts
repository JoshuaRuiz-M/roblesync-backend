/**
 * @openapi
 * tags:
 *   - name: Roles
 *     description: Administración de roles del sistema.
 *
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         role_id:
 *           type: integer
 *           example: 1
 *         code:
 *           type: string
 *           example: ADMIN
 *         name:
 *           type: string
 *           example: Administrador
 *         description:
 *           type: string
 *           nullable: true
 *         is_active:
 *           type: boolean
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *
 *     CreateRole:
 *       type: object
 *       required:
 *         - code
 *         - name
 *       properties:
 *         code:
 *           type: string
 *           example: ADMIN
 *         name:
 *           type: string
 *           example: Administrador
 *         description:
 *           type: string
 *           nullable: true
 *         is_active:
 *           type: boolean
 *           default: true
 *
 *     UpdateRole:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         code:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         is_active:
 *           type: boolean
 */

/**
 * @openapi
 * /api/roles:
 *   get:
 *     tags: [Roles]
 *     summary: Listar roles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: Listado paginado de roles.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso ROLE_READ.
 *
 *   post:
 *     tags: [Roles]
 *     summary: Crear un rol
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRole'
 *     responses:
 *       201:
 *         description: Rol creado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso ROLE_CREATE.
 *       409:
 *         description: Código de rol duplicado.
 *
 * /api/roles/count:
 *   get:
 *     tags: [Roles]
 *     summary: Contar roles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cantidad total de roles.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso ROLE_READ.
 *
 * /api/roles/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *         minimum: 1
 *   get:
 *     tags: [Roles]
 *     summary: Obtener rol por identificador
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rol encontrado.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso ROLE_READ.
 *       404:
 *         description: Rol no encontrado.
 *   patch:
 *     tags: [Roles]
 *     summary: Actualizar un rol
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRole'
 *     responses:
 *       200:
 *         description: Rol actualizado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso ROLE_UPDATE.
 *       404:
 *         description: Rol no encontrado.
 *   delete:
 *     tags: [Roles]
 *     summary: Eliminar un rol
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Rol eliminado correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso ROLE_DELETE.
 *       404:
 *         description: Rol no encontrado.
 * /api/roles/{id}/menu-items:
 *   get:
 *     tags: [Roles]
 *     summary: Consultar opciones de menú asignadas a un rol
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Opciones de menú asignadas al rol.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso ROLE_MENU_READ.
 *       404:
 *         description: Rol no encontrado.
 *
 *   put:
 *     tags: [Roles]
 *     summary: Reemplazar opciones de menú asignadas a un rol
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - menu_item_ids
 *             properties:
 *               menu_item_ids:
 *                 type: array
 *                 uniqueItems: true
 *                 items:
 *                   type: integer
 *                   minimum: 1
 *                 example: [1, 2, 3, 5]
 *     responses:
 *       200:
 *         description: Opciones de menú asignadas correctamente.
 *       400:
 *         description: Una o más opciones de menú no existen.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso ROLE_MENU_SYNC.
 *       404:
 *         description: Rol no encontrado.
 * /api/roles/{id}/permissions:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *         minimum: 1
 *   get:
 *     tags: [Roles]
 *     summary: Consultar permisos asignados a un rol
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Permisos asignados al rol.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso ROLE_PERMISSION_READ.
 *       404:
 *         description: Rol no encontrado.
 *
 *   put:
 *     tags: [Roles]
 *     summary: Reemplazar permisos asignados a un rol
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permission_ids
 *             properties:
 *               permission_ids:
 *                 type: array
 *                 uniqueItems: true
 *                 items:
 *                   type: integer
 *                   minimum: 1
 *                 example: [1, 2, 3, 4]
 *     responses:
 *       200:
 *         description: Permisos asignados correctamente.
 *       400:
 *         description: Uno o más permisos no existen.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso ROLE_PERMISSION_SYNC.
 *       404:
 *         description: Rol no encontrado.
 */

export {};
