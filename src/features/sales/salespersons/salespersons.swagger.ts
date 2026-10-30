/**
 * @openapi
 * tags:
 *   - name: Vendedores
 *     description: Administración de vendedores del sistema.
 *
 * components:
 *   schemas:
 *     Salesperson:
 *       type: object
 *       properties:
 *         salesperson_id:
 *           type: integer
 *           example: 1
 *         user_id:
 *           type: integer
 *           example: 5
 *         employee_code:
 *           type: string
 *           example: VEND-001
 *         phone:
 *           type: string
 *           nullable: true
 *           example: "55551234"
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
 *         created_by:
 *           type: integer
 *           example: 1
 *         updated_by:
 *           type: integer
 *           nullable: true
 *           example: 1
 *
 *     CreateSalesperson:
 *       type: object
 *       additionalProperties: false
 *       required:
 *         - user_id
 *         - employee_code
 *       properties:
 *         user_id:
 *           type: integer
 *           minimum: 1
 *           example: 5
 *         employee_code:
 *           type: string
 *           minLength: 1
 *           maxLength: 30
 *           example: VEND-001
 *         phone:
 *           type: string
 *           maxLength: 30
 *           nullable: true
 *           example: "55551234"
 *         is_active:
 *           type: boolean
 *           default: true
 *           example: true
 *
 *     UpdateSalesperson:
 *       type: object
 *       additionalProperties: false
 *       minProperties: 1
 *       properties:
 *         user_id:
 *           type: integer
 *           minimum: 1
 *           example: 5
 *         employee_code:
 *           type: string
 *           minLength: 1
 *           maxLength: 30
 *           example: VEND-002
 *         phone:
 *           type: string
 *           maxLength: 30
 *           nullable: true
 *           example: "55554321"
 *         is_active:
 *           type: boolean
 *           example: true
 */

/**
 * @openapi
 * /api/salespersons:
 *   get:
 *     tags: [Vendedores]
 *     summary: Listar vendedores
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
 *         description: Listado paginado de vendedores.
 *       400:
 *         description: Parámetros de paginación inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SALESPERSON_READ.
 *
 *   post:
 *     tags: [Vendedores]
 *     summary: Crear un vendedor
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSalesperson'
 *     responses:
 *       201:
 *         description: Vendedor creado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SALESPERSON_CREATE.
 *       404:
 *         description: Usuario asociado no encontrado.
 *       409:
 *         description: Código de empleado o usuario duplicado.
 *
 * /api/salespersons/count:
 *   get:
 *     tags: [Vendedores]
 *     summary: Contar vendedores
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cantidad total de vendedores.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SALESPERSON_READ.
 *
 * /api/salespersons/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *         minimum: 1
 *   get:
 *     tags: [Vendedores]
 *     summary: Obtener vendedor por identificador
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vendedor encontrado.
 *       400:
 *         description: Identificador inválido.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SALESPERSON_READ.
 *       404:
 *         description: Vendedor no encontrado.
 *
 *   patch:
 *     tags: [Vendedores]
 *     summary: Actualizar un vendedor
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSalesperson'
 *     responses:
 *       200:
 *         description: Vendedor actualizado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SALESPERSON_UPDATE.
 *       404:
 *         description: Vendedor o usuario asociado no encontrado.
 *       409:
 *         description: Código de empleado o usuario duplicado.
 *
 *   delete:
 *     tags: [Vendedores]
 *     summary: Eliminar un vendedor
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Vendedor eliminado correctamente.
 *       400:
 *         description: Identificador inválido.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SALESPERSON_DELETE.
 *       404:
 *         description: Vendedor no encontrado.
 *       409:
 *         description: El vendedor tiene relaciones que impiden eliminarlo.
 */

export {};
