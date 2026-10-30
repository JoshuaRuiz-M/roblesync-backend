/**
 * @openapi
 * tags:
 *   - name: Facturas de Venta
 *     description: Administración de facturas de venta del sistema.
 *
 * components:
 *   schemas:
 *     SalesInvoice:
 *       type: object
 *       properties:
 *         sales_invoice_id:
 *           type: integer
 *           format: int64
 *           example: 1
 *         sales_order_id:
 *           type: integer
 *           format: int64
 *           example: 15
 *         customer_id:
 *           type: integer
 *           example: 3
 *         salesperson_id:
 *           type: integer
 *           example: 2
 *         invoice_series:
 *           type: string
 *           maxLength: 50
 *           example: A
 *         invoice_number:
 *           type: string
 *           maxLength: 50
 *           example: "00000125"
 *         dte_uuid:
 *           type: string
 *           nullable: true
 *           maxLength: 100
 *           example: null
 *         invoice_date:
 *           type: string
 *           format: date-time
 *           example: "2026-10-30T18:00:00.000Z"
 *         due_date:
 *           type: string
 *           format: date
 *           example: "2026-11-29"
 *         subtotal:
 *           type: number
 *           minimum: 0
 *           example: 500.00
 *         discount_amount:
 *           type: number
 *           minimum: 0
 *           example: 25.00
 *         tax_amount:
 *           type: number
 *           minimum: 0
 *           example: 57.00
 *         total_amount:
 *           type: number
 *           minimum: 0
 *           example: 532.00
 *         status:
 *           type: string
 *           enum: [ISSUED, CANCELLED]
 *           example: ISSUED
 *         cancellation_reason:
 *           type: string
 *           nullable: true
 *           maxLength: 500
 *           example: null
 *         cancelled_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         cancelled_by:
 *           type: integer
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         created_by:
 *           type: integer
 *           example: 1
 *         updated_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         updated_by:
 *           type: integer
 *           nullable: true
 *
 *     SalesInvoiceDetail:
 *       type: object
 *       properties:
 *         sales_invoice_detail_id:
 *           type: integer
 *           format: int64
 *           example: 1
 *         sales_invoice_id:
 *           type: integer
 *           format: int64
 *           example: 1
 *         product_id:
 *           type: integer
 *           example: 5
 *         quantity:
 *           type: number
 *           exclusiveMinimum: 0
 *           multipleOf: 0.001
 *           example: 10
 *         unit_price:
 *           type: number
 *           minimum: 0
 *           multipleOf: 0.0001
 *           example: 25.00
 *         unit_cost:
 *           type: number
 *           minimum: 0
 *           multipleOf: 0.0001
 *           example: 18.50
 *         discount_amount:
 *           type: number
 *           minimum: 0
 *           example: 0
 *         subtotal:
 *           type: number
 *           minimum: 0
 *           example: 250.00
 *         tax_amount:
 *           type: number
 *           minimum: 0
 *           example: 30.00
 *         total_amount:
 *           type: number
 *           minimum: 0
 *           example: 280.00
 *         created_at:
 *           type: string
 *           format: date-time
 *         created_by:
 *           type: integer
 *           example: 1
 *
 *     CreateSalesInvoice:
 *       type: object
 *       required:
 *         - sales_order_id
 *         - invoice_series
 *         - invoice_number
 *       properties:
 *         sales_order_id:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *           description: Identificador de una orden de venta en estado RESERVED.
 *           example: 15
 *         invoice_series:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           example: A
 *         invoice_number:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           example: "00000125"
 *         dte_uuid:
 *           type: string
 *           nullable: true
 *           minLength: 1
 *           maxLength: 100
 *           description: UUID del Documento Tributario Electrónico, cuando corresponda.
 *           example: null
 *
 *     CancelSalesInvoice:
 *       type: object
 *       required:
 *         - cancellation_reason
 *       properties:
 *         cancellation_reason:
 *           type: string
 *           minLength: 1
 *           maxLength: 500
 *           description: Motivo obligatorio de cancelación de la factura.
 *           example: Error en los datos de facturación.
 *
 * /api/sales-invoices:
 *   get:
 *     tags: [Facturas de Venta]
 *     summary: Listar facturas de venta
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
 *         description: Listado paginado de facturas de venta.
 *       400:
 *         description: Parámetros de paginación inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SALES_INVOICE_READ.
 *
 *   post:
 *     tags: [Facturas de Venta]
 *     summary: Emitir factura de venta
 *     description: Crea una factura en estado ISSUED a partir de una orden RESERVED. Copia los importes de la orden, registra los detalles, consume las reservas, descuenta las existencias por almacén y lote, genera movimientos SALE_DISPATCH y cambia la orden a COMPLETED. Todas las operaciones se realizan dentro de una transacción.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSalesInvoice'
 *           example:
 *             sales_order_id: 15
 *             invoice_series: A
 *             invoice_number: "00000125"
 *     responses:
 *       201:
 *         description: Factura emitida correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SALES_INVOICE_CREATE.
 *       404:
 *         description: Orden de venta o cliente no encontrado.
 *       409:
 *         description: La orden no está reservada, ya tiene una factura o existen inconsistencias en las reservas o existencias de inventario.
 *
 * /api/sales-invoices/count:
 *   get:
 *     tags: [Facturas de Venta]
 *     summary: Contar facturas de venta
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cantidad total de facturas de venta.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SALES_INVOICE_READ.
 *
 * /api/sales-invoices/{id}:
 *   get:
 *     tags: [Facturas de Venta]
 *     summary: Obtener factura de venta por identificador
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Factura de venta encontrada.
 *       400:
 *         description: Identificador inválido.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SALES_INVOICE_READ.
 *       404:
 *         description: Factura de venta no encontrada.
 *
 * /api/sales-invoices/{id}/details:
 *   get:
 *     tags: [Facturas de Venta]
 *     summary: Consultar detalles de una factura de venta
 *     description: Obtiene los productos facturados, cantidades, precios, costos, descuentos, impuestos y totales.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Detalles de la factura obtenidos correctamente.
 *       400:
 *         description: Identificador inválido.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SALES_INVOICE_READ.
 *       404:
 *         description: Factura de venta no encontrada.
 *
 * /api/sales-invoices/{id}/cancel:
 *   patch:
 *     tags: [Facturas de Venta]
 *     summary: Cancelar factura de venta
 *     description: Cancela una factura en estado ISSUED y registra el motivo, fecha y usuario responsable. No devuelve automáticamente las existencias ni cambia el estado COMPLETED de la orden de venta. Las devoluciones físicas deben gestionarse por separado.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CancelSalesInvoice'
 *           example:
 *             cancellation_reason: Error en los datos de facturación.
 *     responses:
 *       200:
 *         description: Factura cancelada correctamente.
 *       400:
 *         description: Datos inválidos o motivo de cancelación vacío.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SALES_INVOICE_CANCEL.
 *       404:
 *         description: Factura de venta no encontrada.
 *       409:
 *         description: La factura ya está cancelada.
 */

export {};
