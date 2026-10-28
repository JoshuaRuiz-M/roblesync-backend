/**
 * @openapi
 * tags:
 *   - name: Opciones de menú
 *     description: Administración del catálogo de opciones de menú.
 *
 * components:
 *   schemas:
 *     MenuItem:
 *       type: object
 *       properties:
 *         menu_item_id:
 *           type: integer
 *           example: 1
 *         parent_id:
 *           type: integer
 *           nullable: true
 *           example: null
 *         code:
 *           type: string
 *           example: SECURITY
 *         label:
 *           type: string
 *           example: Seguridad
 *         path:
 *           type: string
 *           nullable: true
 *           example: null
 *         icon:
 *           type: string
 *           nullable: true
 *           example: shield
 *         sort_order:
 *           type: integer
 *           example: 1
 *         is_active:
 *           type: boolean
 *           example: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *
 *     CreateMenuItem:
 *       type: object
 *       required:
 *         - code
 *         - label
 *         - sort_order
 *       properties:
 *         parent_id:
 *           type: integer
 *           nullable: true
 *           minimum: 1
 *         code:
 *           type: string
 *           maxLength: 100
 *           pattern: '^[A-Z][A-Z0-9_]*$'
 *           example: USERS
 *         label:
 *           type: string
 *           maxLength: 150
 *           example: Usuarios
 *         path:
 *           type: string
 *           nullable: true
 *           maxLength: 255
 *           example: /users
 *         icon:
 *           type: string
 *           nullable: true
 *           maxLength: 100
 *           example: users
 *         sort_order:
 *           type: integer
 *           minimum: 0
 *           example: 1
 *         is_active:
 *           type: boolean
 *           default: true
 *
 *     UpdateMenuItem:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         parent_id:
 *           type: integer
 *           nullable: true
 *           minimum: 1
 *         code:
 *           type: string
 *           maxLength: 100
 *         label:
 *           type: string
 *           maxLength: 150
 *         path:
 *           type: string
 *           nullable: true
 *           maxLength: 255
 *         icon:
 *           type: string
 *           nullable: true
 *           maxLength: 100
 *         sort_order:
 *           type: integer
 *           minimum: 0
 *         is_active:
 *           type: boolean
 */

/**
 * @openapi
 * /api/menu-items:
 *   get:
 *     tags: [Opciones de menú]
 *     summary: Listar opciones de menú
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
 *         description: Listado paginado de opciones de menú.
 *       400:
 *         description: Parámetros inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso MENU_ITEM_READ.
 *
 *   post:
 *     tags: [Opciones de menú]
 *     summary: Crear una opción de menú
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMenuItem'
 *     responses:
 *       201:
 *         description: Opción de menú creada.
 *       400:
 *         description: Datos inválidos o padre inexistente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso MENU_ITEM_CREATE.
 *
 * /api/menu-items/count:
 *   get:
 *     tags: [Opciones de menú]
 *     summary: Contar opciones de menú
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cantidad total de opciones de menú.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso MENU_ITEM_READ.
 *
 * /api/menu-items/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *         minimum: 1
 *   get:
 *     tags: [Opciones de menú]
 *     summary: Obtener una opción de menú
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Opción de menú encontrada.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso MENU_ITEM_READ.
 *       404:
 *         description: Opción de menú no encontrada.
 *
 *   patch:
 *     tags: [Opciones de menú]
 *     summary: Actualizar una opción de menú
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMenuItem'
 *     responses:
 *       200:
 *         description: Opción de menú actualizada.
 *       400:
 *         description: Datos inválidos o jerarquía circular.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso MENU_ITEM_UPDATE.
 *       404:
 *         description: Opción de menú no encontrada.
 *
 *   delete:
 *     tags: [Opciones de menú]
 *     summary: Eliminar una opción de menú
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Opción de menú eliminada.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso MENU_ITEM_DELETE.
 *       404:
 *         description: Opción de menú no encontrada.
 *       409:
 *         description: La opción tiene hijos o asignaciones a roles.
 */

export {};
