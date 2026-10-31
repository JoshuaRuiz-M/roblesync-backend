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
 *           description: Cantidad positiva para entradas y negativa para salidas.
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
 *
 *     DashboardOverview:
 *       type: object
 *       properties:
 *         sales_total:
 *           type: number
 *           format: double
 *           description: Importe total de facturas emitidas durante el período.
 *           example: 125000.00
 *         purchases_total:
 *           type: number
 *           format: double
 *           description: Importe de órdenes de compra aprobadas, parcialmente recibidas o recibidas.
 *           example: 85000.00
 *         active_customers:
 *           type: integer
 *           description: Cantidad actual de clientes activos.
 *           example: 150
 *         low_stock_products:
 *           type: integer
 *           description: Productos activos con stock disponible menor o igual al punto de reorden.
 *           example: 12
 *
 *     DashboardSalesTrend:
 *       type: object
 *       properties:
 *         year:
 *           type: integer
 *           example: 2026
 *         month:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           example: 10
 *         period:
 *           type: string
 *           description: Período en formato YYYY-MM.
 *           example: "2026-10"
 *         total_sales:
 *           type: number
 *           format: double
 *           example: 45000.00
 *         invoice_count:
 *           type: integer
 *           example: 35
 *
 *     DashboardTopProduct:
 *       type: object
 *       properties:
 *         product_id:
 *           type: integer
 *           example: 5
 *         sku:
 *           type: string
 *           example: BEB-001
 *         product_name:
 *           type: string
 *           example: Coca-Cola 600 ml
 *         quantity_sold:
 *           type: number
 *           format: double
 *           example: 740.000
 *         total_sales:
 *           type: number
 *           format: double
 *           example: 18500.00
 *         invoice_count:
 *           type: integer
 *           example: 85
 *         average_unit_price:
 *           type: number
 *           format: double
 *           nullable: true
 *           description: Precio promedio por unidad sin impuestos y después de descuentos.
 *           example: 22.5000
 *
 *     DashboardSalesByCategory:
 *       type: object
 *       properties:
 *         category_id:
 *           type: integer
 *           example: 1
 *         category_name:
 *           type: string
 *           example: Bebidas
 *         total_sales:
 *           type: number
 *           format: double
 *           example: 45000.00
 *         quantity_sold:
 *           type: number
 *           format: double
 *           example: 1800.000
 *         invoice_count:
 *           type: integer
 *           example: 125
 *         percentage:
 *           type: number
 *           format: double
 *           description: Participación porcentual en las ventas.
 *           example: 45.00
 *
 *     DashboardInventoryAlert:
 *       type: object
 *       properties:
 *         alert_type:
 *           type: string
 *           enum:
 *             - OUT_OF_STOCK
 *             - LOW_STOCK
 *             - EXPIRED
 *             - EXPIRING_SOON
 *           example: EXPIRING_SOON
 *         priority:
 *           type: string
 *           enum:
 *             - HIGH
 *             - MEDIUM
 *           example: MEDIUM
 *         product_id:
 *           type: integer
 *           example: 5
 *         sku:
 *           type: string
 *           example: LAC-001
 *         product_name:
 *           type: string
 *           example: Leche entera 1 L
 *         warehouse_id:
 *           type: integer
 *           nullable: true
 *           example: 1
 *         warehouse_name:
 *           type: string
 *           nullable: true
 *           example: Bodega Principal
 *         batch_id:
 *           type: integer
 *           nullable: true
 *           example: 3
 *         batch_number:
 *           type: string
 *           nullable: true
 *           example: LOT-2026-001
 *         expiration_date:
 *           type: string
 *           format: date
 *           nullable: true
 *           example: "2026-11-12"
 *         available_quantity:
 *           type: number
 *           format: double
 *           example: 24.000
 *         reorder_point:
 *           type: number
 *           format: double
 *           example: 30.000
 *         days_until_expiration:
 *           type: integer
 *           nullable: true
 *           description: Días restantes para vencer. Negativo si ya venció.
 *           example: 13
 *
 *     DashboardOverviewResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/DashboardOverview'
 *
 *     DashboardSalesTrendResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DashboardSalesTrend'
 *
 *     DashboardTopProductsResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DashboardTopProduct'
 *
 *     DashboardSalesByCategoryResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DashboardSalesByCategory'
 *
 *     DashboardInventoryAlertsResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DashboardInventoryAlert'
 */

/**
 * @openapi
 * /api/analytics/movements:
 *   get:
 *     tags: [Analíticas]
 *     summary: Consultar movimientos del Kardex
 *     description: Obtiene movimientos de inventario con filtros opcionales y paginación. Los saldos acumulados corresponden al producto y la bodega, no exclusivamente al lote o tipo de movimiento filtrado.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: product_id
 *         description: Identificador del producto.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 5
 *       - in: query
 *         name: warehouse_id
 *         description: Identificador de la bodega.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *       - in: query
 *         name: batch_id
 *         description: Identificador del lote.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 3
 *       - in: query
 *         name: movement_type
 *         description: Tipo de movimiento.
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
 *         description: Fecha inicial, inclusive.
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-10-01"
 *       - in: query
 *         name: end_date
 *         description: Fecha final, inclusive. Debe ser igual o posterior a start_date.
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
 *     description: Obtiene saldos iniciales y finales, entradas y salidas de un producto en una bodega durante un período.
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
 *         description: Fecha inicial, inclusive.
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-10-01"
 *       - in: query
 *         name: end_date
 *         description: Fecha final, inclusive. Debe ser igual o posterior a start_date.
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
 *         description: Error interno al consultar el resumen.
 *
 * /api/analytics/dashboard/overview:
 *   get:
 *     tags: [Analíticas]
 *     summary: Consultar indicadores generales del Dashboard
 *     description: Obtiene ventas facturadas, valor de órdenes de compra aprobadas o recibidas, clientes activos y productos con bajo stock. Las fechas solo afectan ventas y compras.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start_date
 *         description: Fecha inicial, inclusive.
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-10-01"
 *       - in: query
 *         name: end_date
 *         description: Fecha final, inclusive. Debe ser igual o posterior a start_date.
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-10-31"
 *     responses:
 *       200:
 *         description: Indicadores generales obtenidos correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardOverviewResponse'
 *       400:
 *         description: Parámetros de consulta inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso ANALYTICS_DASHBOARD_READ.
 *       500:
 *         description: Error interno al consultar los indicadores.
 *
 * /api/analytics/dashboard/sales-trend:
 *   get:
 *     tags: [Analíticas]
 *     summary: Consultar evolución mensual de ventas
 *     description: Obtiene ventas facturadas agrupadas por mes, incluyendo meses sin ventas. Sin filtros, consulta los últimos doce meses, incluyendo el actual.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start_date
 *         description: Fecha inicial, inclusive.
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-01-01"
 *       - in: query
 *         name: end_date
 *         description: Fecha final, inclusive. Debe ser igual o posterior a start_date.
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-12-31"
 *     responses:
 *       200:
 *         description: Evolución mensual de ventas obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardSalesTrendResponse'
 *       400:
 *         description: Parámetros de consulta inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso ANALYTICS_DASHBOARD_READ.
 *       500:
 *         description: Error interno al consultar las ventas.
 *
 * /api/analytics/dashboard/top-products:
 *   get:
 *     tags: [Analíticas]
 *     summary: Consultar productos más vendidos
 *     description: Obtiene los productos con mayores ingresos facturados, ordenados de mayor a menor. Solo considera facturas emitidas. Sin fechas, consulta todo el historial.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start_date
 *         description: Fecha inicial, inclusive.
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-10-01"
 *       - in: query
 *         name: end_date
 *         description: Fecha final, inclusive. Debe ser igual o posterior a start_date.
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-10-31"
 *       - in: query
 *         name: top
 *         description: Cantidad máxima de productos.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 5
 *           example: 5
 *     responses:
 *       200:
 *         description: Ranking de productos obtenido correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardTopProductsResponse'
 *       400:
 *         description: Parámetros de consulta inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso ANALYTICS_DASHBOARD_READ.
 *       500:
 *         description: Error interno al consultar los productos.
 *
 * /api/analytics/dashboard/sales-by-category:
 *   get:
 *     tags: [Analíticas]
 *     summary: Consultar ventas por categoría
 *     description: Obtiene ingresos, cantidades vendidas, facturas y participación porcentual de cada categoría. Solo considera facturas emitidas. Sin fechas, consulta todo el historial.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start_date
 *         description: Fecha inicial, inclusive.
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-10-01"
 *       - in: query
 *         name: end_date
 *         description: Fecha final, inclusive. Debe ser igual o posterior a start_date.
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-10-31"
 *     responses:
 *       200:
 *         description: Distribución de ventas obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardSalesByCategoryResponse'
 *       400:
 *         description: Parámetros de consulta inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso ANALYTICS_DASHBOARD_READ.
 *       500:
 *         description: Error interno al consultar las categorías.
 *
 * /api/analytics/dashboard/inventory-alerts:
 *   get:
 *     tags: [Analíticas]
 *     summary: Consultar alertas de inventario
 *     description: Obtiene productos sin existencias, bajo punto de reorden, lotes vencidos y próximos a vencer. El stock general se calcula sobre todas las bodegas; las alertas de vencimiento se identifican por lote y bodega.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: expiration_days
 *         description: Días futuros para identificar lotes próximos a vencer. Los lotes vencidos también se incluyen.
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 365
 *           default: 30
 *           example: 30
 *       - in: query
 *         name: top
 *         description: Cantidad máxima de alertas.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *           example: 20
 *     responses:
 *       200:
 *         description: Alertas de inventario obtenidas correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardInventoryAlertsResponse'
 *       400:
 *         description: Parámetros de consulta inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso ANALYTICS_DASHBOARD_READ.
 *       500:
 *         description: Error interno al consultar las alertas.
 */

export {};
