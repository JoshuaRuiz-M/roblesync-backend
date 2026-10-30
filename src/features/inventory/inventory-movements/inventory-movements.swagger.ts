/**
 * @openapi
 * tags:
 *   - name: Movimientos de Inventario
 *     description: Administración de movimientos de inventario del sistema.
 *
 * components:
 *   schemas:
 *     InventoryMovement:
 *       type: object
 *       properties:
 *         inventory_movement_id:
 *           type: integer
 *           example: 1
 *         warehouse_id:
 *           type: integer
 *           example: 1
 *         product_id:
 *           type: integer
 *           example: 1
 *         batch_id:
 *           type: integer
 *           nullable: true
 *           example: 1
 *         movement_type:
 *           type: string
 *           example: ENTRY
 *         movement_date:
 *           type: string
 *           format: date
 *           example: "2026-10-29"
 *         quantity:
 *           type: number
 *           example: 100
 *         unit_cost:
 *           type: number
 *           example: 15.50
 *         total_cost:
 *           type: number
 *           example: 1550.00
 *         balance_quantity:
 *           type: number
 *           example: 250
 *         balance_value:
 *           type: number
 *           example: 3875.00
 *         reference_type:
 *           type: string
 *           nullable: true
 *           example: PURCHASE_ORDER
 *         reference_id:
 *           type: integer
 *           nullable: true
 *           example: 10
 *         notes:
 *           type: string
 *           nullable: true
 *           example: Entrada de mercadería por compra.
 *         created_at:
 *           type: string
 *           format: date-time
 *         created_by:
 *           type: integer
 *           example: 1
 *
 *     CreateInventoryMovement:
 *       type: object
 *       additionalProperties: false
 *       required:
 *         - warehouse_id
 *         - product_id
 *         - movement_type
 *         - movement_date
 *         - quantity
 *         - unit_cost
 *         - total_cost
 *         - balance_quantity
 *         - balance_value
 *       properties:
 *         warehouse_id:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         product_id:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         batch_id:
 *           type: integer
 *           minimum: 1
 *           nullable: true
 *           example: 1
 *         movement_type:
 *           type: string
 *           minLength: 1
 *           maxLength: 30
 *           example: ENTRY
 *         movement_date:
 *           type: string
 *           format: date
 *           pattern: '^\d{4}-\d{2}-\d{2}$'
 *           example: "2026-10-29"
 *         quantity:
 *           type: number
 *           exclusiveMinimum: 0
 *           example: 100
 *         unit_cost:
 *           type: number
 *           exclusiveMinimum: 0
 *           example: 15.50
 *         total_cost:
 *           type: number
 *           exclusiveMinimum: 0
 *           example: 1550.00
 *         balance_quantity:
 *           type: number
 *           exclusiveMinimum: 0
 *           example: 250
 *         balance_value:
 *           type: number
 *           exclusiveMinimum: 0
 *           example: 3875.00
 *         reference_type:
 *           type: string
 *           maxLength: 50
 *           nullable: true
 *           example: PURCHASE_ORDER
 *         reference_id:
 *           type: integer
 *           minimum: 1
 *           nullable: true
 *           example: 10
 *         notes:
 *           type: string
 *           maxLength: 500
 *           nullable: true
 *           example: Entrada de mercadería por compra.
 *
 *     UpdateInventoryMovement:
 *       type: object
 *       additionalProperties: false
 *       minProperties: 1
 *       properties:
 *         warehouse_id:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         product_id:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         batch_id:
 *           type: integer
 *           minimum: 1
 *           nullable: true
 *           example: 1
 *         movement_type:
 *           type: string
 *           minLength: 1
 *           maxLength: 30
 *           example: EXIT
 *         movement_date:
 *           type: string
 *           format: date
 *           pattern: '^\d{4}-\d{2}-\d{2}$'
 *           example: "2026-10-30"
 *         quantity:
 *           type: number
 *           exclusiveMinimum: 0
 *           example: 50
 *         unit_cost:
 *           type: number
 *           exclusiveMinimum: 0
 *           example: 15.50
 *         total_cost:
 *           type: number
 *           exclusiveMinimum: 0
 *           example: 775.00
 *         balance_quantity:
 *           type: number
 *           exclusiveMinimum: 0
 *           example: 200
 *         balance_value:
 *           type: number
 *           exclusiveMinimum: 0
 *           example: 3100.00
 *         reference_type:
 *           type: string
 *           maxLength: 50
 *           nullable: true
 *           example: SALE
 *         reference_id:
 *           type: integer
 *           minimum: 1
 *           nullable: true
 *           example: 15
 *         notes:
 *           type: string
 *           maxLength: 500
 *           nullable: true
 *           example: Salida de inventario por venta.
 */

/**
 * @openapi
 * /api/inventory-movements:
 *   get:
 *     tags: [Movimientos de Inventario]
 *     summary: Listar movimientos de inventario
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
 *         description: Listado paginado de movimientos de inventario.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso INVENTORY_MOVEMENT_READ.
 *
 *   post:
 *     tags: [Movimientos de Inventario]
 *     summary: Crear un movimiento de inventario
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInventoryMovement'
 *     responses:
 *       201:
 *         description: Movimiento de inventario creado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso INVENTORY_MOVEMENT_CREATE.
 *       409:
 *         description: Conflicto al crear el movimiento de inventario.
 *
 * /api/inventory-movements/count:
 *   get:
 *     tags: [Movimientos de Inventario]
 *     summary: Contar movimientos de inventario
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cantidad total de movimientos de inventario.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso INVENTORY_MOVEMENT_READ.
 *
 * /api/inventory-movements/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *         minimum: 1
 *
 *   get:
 *     tags: [Movimientos de Inventario]
 *     summary: Obtener movimiento de inventario por identificador
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Movimiento de inventario encontrado.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso INVENTORY_MOVEMENT_READ.
 *       404:
 *         description: Movimiento de inventario no encontrado.
 *
 *   patch:
 *     tags: [Movimientos de Inventario]
 *     summary: Actualizar un movimiento de inventario
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateInventoryMovement'
 *     responses:
 *       200:
 *         description: Movimiento de inventario actualizado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso INVENTORY_MOVEMENT_UPDATE.
 *       404:
 *         description: Movimiento de inventario no encontrado.
 *       409:
 *         description: Conflicto al actualizar el movimiento de inventario.
 *
 *   delete:
 *     tags: [Movimientos de Inventario]
 *     summary: Eliminar un movimiento de inventario
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Movimiento de inventario eliminado correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso INVENTORY_MOVEMENT_DELETE.
 *       404:
 *         description: Movimiento de inventario no encontrado.
 *       409:
 *         description: El movimiento de inventario tiene relaciones que impiden eliminarlo.
 */

export {};
