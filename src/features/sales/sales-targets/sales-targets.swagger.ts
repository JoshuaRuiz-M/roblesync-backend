/**
 * @openapi
 * tags:
 *   - name: Objetivos de Ventas
 *     description: Administración de objetivos de ventas asignados a vendedores del sistema.
 *
 * components:
 *   schemas:
 *     SalesTarget:
 *       type: object
 *       properties:
 *         sales_target_id:
 *           type: integer
 *           example: 1
 *         salesperson_id:
 *           type: integer
 *           example: 5
 *         target_year:
 *           type: integer
 *           example: 2026
 *         target_month:
 *           type: integer
 *           example: 10
 *         target_amount:
 *           type: number
 *           format: double
 *           example: 15000.00
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
 *     CreateSalesTarget:
 *       type: object
 *       additionalProperties: false
 *       required:
 *         - salesperson_id
 *         - target_year
 *         - target_month
 *         - target_amount
 *       properties:
 *         salesperson_id:
 *           type: integer
 *           minimum: 1
 *           example: 5
 *         target_year:
 *           type: integer
 *           minimum: 2000
 *           maximum: 2100
 *           example: 2026
 *         target_month:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           example: 10
 *         target_amount:
 *           type: number
 *           format: double
 *           exclusiveMinimum: 0
 *           example: 15000.00
 *
 *     UpdateSalesTarget:
 *       type: object
 *       additionalProperties: false
 *       minProperties: 1
 *       properties:
 *         salesperson_id:
 *           type: integer
 *           minimum: 1
 *           example: 5
 *         target_year:
 *           type: integer
 *           minimum: 2000
 *           maximum: 2100
 *           example: 2026
 *         target_month:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           example: 11
 *         target_amount:
 *           type: number
 *           format: double
 *           exclusiveMinimum: 0
 *           example: 18000.00
 */

/**
 * @openapi
 * /api/sales-targets:
 *   get:
 *     tags: [Objetivos de Ventas]
 *     summary: Listar objetivos de ventas
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
 *         description: Listado paginado de objetivos de ventas.
 *       400:
 *         description: Parámetros de paginación inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SALESTARGET_READ.
 *
 *   post:
 *     tags: [Objetivos de Ventas]
 *     summary: Crear un objetivo de ventas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSalesTarget'
 *     responses:
 *       201:
 *         description: Objetivo de ventas creado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SALESTARGET_CREATE.
 *       404:
 *         description: Vendedor asociado no encontrado.
 *       409:
 *         description: Ya existe un objetivo de ventas para el vendedor, año y mes indicados.
 *
 * /api/sales-targets/count:
 *   get:
 *     tags: [Objetivos de Ventas]
 *     summary: Contar objetivos de ventas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cantidad total de objetivos de ventas.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SALESTARGET_READ.
 *
 * /api/sales-targets/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *         minimum: 1
 *   get:
 *     tags: [Objetivos de Ventas]
 *     summary: Obtener objetivo de ventas por identificador
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Objetivo de ventas encontrado.
 *       400:
 *         description: Identificador inválido.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SALESTARGET_READ.
 *       404:
 *         description: Objetivo de ventas no encontrado.
 *
 *   patch:
 *     tags: [Objetivos de Ventas]
 *     summary: Actualizar un objetivo de ventas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSalesTarget'
 *     responses:
 *       200:
 *         description: Objetivo de ventas actualizado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SALESTARGET_UPDATE.
 *       404:
 *         description: Objetivo de ventas o vendedor asociado no encontrado.
 *       409:
 *         description: Ya existe un objetivo de ventas para el vendedor, año y mes indicados.
 *
 *   delete:
 *     tags: [Objetivos de Ventas]
 *     summary: Eliminar un objetivo de ventas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Objetivo de ventas eliminado correctamente.
 *       400:
 *         description: Identificador inválido.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SALESTARGET_DELETE.
 *       404:
 *         description: Objetivo de ventas no encontrado.
 *       409:
 *         description: El objetivo de ventas tiene relaciones que impiden eliminarlo.
 */

export {};
