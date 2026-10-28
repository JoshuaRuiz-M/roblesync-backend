/**
 * @openapi
 * tags:
 *   - name: Permisos
 *     description: Administración de permisos del sistema.
 *
 * components:
 *   schemas:
 *     Permission:
 *       type: object
 *       properties:
 *         permission_id:
 *           type: integer
 *           example: 1
 *         code:
 *           type: string
 *           example: USER_READ
 *         name:
 *           type: string
 *           example: Consultar usuarios
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
 *     CreatePermission:
 *       type: object
 *       required:
 *         - code
 *         - name
 *       properties:
 *         code:
 *           type: string
 *           maxLength: 150
 *           example: USER_READ
 *         name:
 *           type: string
 *           maxLength: 150
 *           example: Consultar usuarios
 *         description:
 *           type: string
 *           maxLength: 500
 *           nullable: true
 *         is_active:
 *           type: boolean
 *           default: true
 *
 *     UpdatePermission:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         code:
 *           type: string
 *           maxLength: 150
 *         name:
 *           type: string
 *           maxLength: 150
 *         description:
 *           type: string
 *           maxLength: 500
 *           nullable: true
 *         is_active:
 *           type: boolean
 */

/**
 * @openapi
 * /api/permissions:
 *   get:
 *     tags: [Permisos]
 *     summary: Listar permisos
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
 *         description: Listado paginado de permisos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PERMISSION_READ.
 *
 *   post:
 *     tags: [Permisos]
 *     summary: Crear un permiso
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePermission'
 *     responses:
 *       201:
 *         description: Permiso creado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PERMISSION_CREATE.
 *       409:
 *         description: Código de permiso duplicado.
 *
 * /api/permissions/count:
 *   get:
 *     tags: [Permisos]
 *     summary: Contar permisos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cantidad total de permisos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PERMISSION_READ.
 *
 * /api/permissions/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *         minimum: 1
 *   get:
 *     tags: [Permisos]
 *     summary: Obtener permiso por identificador
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Permiso encontrado.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PERMISSION_READ.
 *       404:
 *         description: Permiso no encontrado.
 *
 *   patch:
 *     tags: [Permisos]
 *     summary: Actualizar un permiso
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePermission'
 *     responses:
 *       200:
 *         description: Permiso actualizado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PERMISSION_UPDATE.
 *       404:
 *         description: Permiso no encontrado.
 *       409:
 *         description: Código de permiso duplicado.
 *
 *   delete:
 *     tags: [Permisos]
 *     summary: Eliminar un permiso
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Permiso eliminado correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PERMISSION_DELETE.
 *       404:
 *         description: Permiso no encontrado.
 *       409:
 *         description: El permiso tiene relaciones que impiden eliminarlo.
 */

export {};
