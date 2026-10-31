/**
 * @openapi
 * tags:
 *   - name: Analíticas
 *     description: Consultas y reportes analíticos del sistema.
 *
 * components:
 *   schemas:
 *     KardexMovement:
 *       type: object
 *       properties:
 *         inventory_movement_id:
 *           type: integer
 *           example: 1
 *         warehouse_id:
 *           type: integer
 *           example: 1
 *         warehouse_name:
 *           type: string
 *           example: Bodega Principal
 *         product_id:
 *           type: integer
 *           example: 5
 *         product_name:
 *           type: string
 *           example: Aceite vegetal 900 ml
 *         batch_id:
 *           type: integer
 *           nullable: true
 *           example: 3
 *         batch_number:
 *           type: string
 *           nullable: true
 *           example: LOT-2026-001
 *         movement_type:
 *           type: string
 *           enum:
 *             - PURCHASE_RECEIPT
 *             - SALE_DISPATCH
 *             - TRANSFER_IN
 *             - TRANSFER_OUT
 *             - ADJUSTMENT_IN
 *             - ADJUSTMENT_OUT
 *             - RETURN_IN
 *             - RETURN_OUT
 *           example: PURCHASE_RECEIPT
 *         movement_date:
 *           type: string
 *           format: date-time
 *           example: "2026-10-30T14:30:00.000Z"
 *         quantity:
 *           type: number
 *           format: double
 *           description: Cantidad con signo positivo para entradas y negativo para salidas.
 *           example: 50.000
 *         unit_cost:
 *           type: number
 *           format: double
 *           example: 12.5000
 *         total_cost:
 *           type: number
 *           format: double
 *           description: Valor total del movimiento con signo.
 *           example: 625.0000
 *         balance_quantity:
 *           type: number
 *           format: double
 *           description: Saldo acumulado del producto en la bodega.
 *           example: 150.000
 *         balance_value:
 *           type: number
 *           format: double
 *           description: Valor acumulado del producto en la bodega.
 *           example: 1875.0000
 *         reference_type:
 *           type: string
 *           nullable: true
 *           example: PURCHASE_RECEIPT
 *         reference_id:
 *           type: integer
 *           nullable: true
 *           example: 10
 *         notes:
 *           type: string
 *           nullable: true
 *           example: Recepción de mercancía.
 *         created_at:
 *           type: string
 *           format: date-time
 *         created_by:
 *           type: integer
 *           example: 1
 *
 *     KardexSummary:
 *       type: object
 *       properties:
 *         product_id:
 *           type: integer
 *           example: 5
 *         warehouse_id:
 *           type: integer
 *           example: 1
 *         opening_quantity:
 *           type: number
 *           format: double
 *           example: 100.000
 *         opening_value:
 *           type: number
 *           format: double
 *           example: 1250.0000
 *         incoming_quantity:
 *           type: number
 *           format: double
 *           example: 50.000
 *         incoming_value:
 *           type: number
 *           format: double
 *           example: 625.0000
 *         outgoing_quantity:
 *           type: number
 *           format: double
 *           example: 30.000
 *         outgoing_value:
 *           type: number
 *           format: double
 *           example: 375.0000
 *         closing_quantity:
 *           type: number
 *           format: double
 *           example: 120.000
 *         closing_value:
 *           type: number
 *           format: double
 *           example: 1500.0000
 *
 *     KardexPaginationMeta:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 10
 *         total:
 *           type: integer
 *           example: 25
 *         totalPages:
 *           type: integer
 *           example: 3
 *         hasNextPage:
 *           type: boolean
 *           example: true
 *         hasPreviousPage:
 *           type: boolean
 *           example: false
 *
 *     KardexPaginatedResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/KardexMovement'
 *         meta:
 *           $ref: '#/components/schemas/KardexPaginationMeta'
 *
 *     KardexSummaryResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/KardexSummary'
 */

/**
 * @openapi
 * /api/analytics/movements:
 *   get:
 *     tags: [Analíticas]
 *     summary: Consultar movimientos del Kardex
 *     description: Obtiene los movimientos de inventario con filtros opcionales y paginación. Los saldos acumulados corresponden al producto y la bodega, no exclusivamente al lote o tipo de movimiento filtrado.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: product_id
 *         description: Filtrar por identificador del producto.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 5
 *       - in: query
 *         name: warehouse_id
 *         description: Filtrar por identificador de la bodega.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *       - in: query
 *         name: batch_id
 *         description: Filtrar por identificador del lote.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 3
 *       - in: query
 *         name: movement_type
 *         description: Filtrar por tipo de movimiento.
 *         schema:
 *           type: string
 *           enum:
 *             - PURCHASE_RECEIPT
 *             - SALE_DISPATCH
 *             - TRANSFER_IN
 *             - TRANSFER_OUT
 *             - ADJUSTMENT_IN
 *             - ADJUSTMENT_OUT
 *             - RETURN_IN
 *             - RETURN_OUT
 *           example: PURCHASE_RECEIPT
 *       - in: query
 *         name: start_date
 *         description: Fecha inicial del período, inclusive.
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-10-01"
 *       - in: query
 *         name: end_date
 *         description: Fecha final del período, inclusive. Debe ser igual o posterior a start_date.
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-10-30"
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
 *         description: Listado paginado de movimientos del Kardex.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KardexPaginatedResponse'
 *       400:
 *         description: Parámetros de consulta inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso ANALYTICS_KARDEX_READ.
 *       500:
 *         description: Error interno al consultar los movimientos.
 *
 * /api/analytics/summary:
 *   get:
 *     tags: [Analíticas]
 *     summary: Consultar resumen del Kardex
 *     description: Obtiene los saldos iniciales y finales, las entradas y las salidas de un producto en una bodega durante un período determinado.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: product_id
 *         required: true
 *         description: Identificador del producto.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 5
 *       - in: query
 *         name: warehouse_id
 *         required: true
 *         description: Identificador de la bodega.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *       - in: query
 *         name: start_date
 *         description: Fecha inicial del período, inclusive.
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-10-01"
 *       - in: query
 *         name: end_date
 *         description: Fecha final del período, inclusive. Debe ser igual o posterior a start_date.
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-10-30"
 *     responses:
 *       200:
 *         description: Resumen del Kardex obtenido correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KardexSummaryResponse'
 *       400:
 *         description: Parámetros de consulta inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso ANALYTICS_KARDEX_READ.
 *       500:
 *         description: Error interno al consultar el resumen del Kardex.
 */

export {};
