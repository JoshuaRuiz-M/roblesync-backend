/**
 * @openapi
 * tags:
 *   - name: Órdenes de Venta
 *     description: Administración de órdenes de venta del sistema.
 *
 * components:
 *   schemas:
 *     SalesOrder:
 *       type: object
 *       properties:
 *         sales_order_id:
 *           type: integer
 *           format: int64
 *           example: 1
 *         order_number:
 *           type: string
 *           example: OV-000001
 *         customer_id:
 *           type: integer
 *           example: 1
 *         salesperson_id:
 *           type: integer
 *           example: 1
 *         warehouse_id:
 *           type: integer
 *           example: 1
 *         order_date:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [DRAFT, PENDING, APPROVED, RESERVED, COMPLETED, CANCELLED]
 *           example: DRAFT
 *         credit_status:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *           example: PENDING
 *         credit_authorized_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         credit_authorized_by:
 *           type: integer
 *           nullable: true
 *         subtotal:
 *           type: number
 *           example: 250
 *         discount_amount:
 *           type: number
 *           example: 10
 *         tax_amount:
 *           type: number
 *           example: 28.80
 *         total_amount:
 *           type: number
 *           example: 268.80
 *         notes:
 *           type: string
 *           nullable: true
 *           maxLength: 500
 *           example: Entregar durante horario de oficina.
 *         created_at:
 *           type: string
 *           format: date-time
 *         created_by:
 *           type: integer
 *         updated_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         updated_by:
 *           type: integer
 *           nullable: true
 *
 *     SalesOrderDetail:
 *       type: object
 *       properties:
 *         sales_order_detail_id:
 *           type: integer
 *           format: int64
 *           example: 1
 *         sales_order_id:
 *           type: integer
 *           format: int64
 *           example: 1
 *         product_id:
 *           type: integer
 *           example: 1
 *         quantity:
 *           type: number
 *           exclusiveMinimum: 0
 *           multipleOf: 0.001
 *           example: 10
 *         quantity_reserved:
 *           type: number
 *           minimum: 0
 *           multipleOf: 0.001
 *           example: 0
 *         unit_price:
 *           type: number
 *           minimum: 0
 *           multipleOf: 0.0001
 *           example: 25
 *         discount_amount:
 *           type: number
 *           minimum: 0
 *           example: 10
 *         subtotal:
 *           type: number
 *           minimum: 0
 *           example: 250
 *         tax_amount:
 *           type: number
 *           minimum: 0
 *           example: 28.80
 *         total_amount:
 *           type: number
 *           minimum: 0
 *           example: 268.80
 *         created_at:
 *           type: string
 *           format: date-time
 *         created_by:
 *           type: integer
 *         updated_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         updated_by:
 *           type: integer
 *           nullable: true
 *
 *     CreateSalesOrderDetail:
 *       type: object
 *       required:
 *         - product_id
 *         - quantity
 *         - unit_price
 *       properties:
 *         product_id:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         quantity:
 *           type: number
 *           exclusiveMinimum: 0
 *           multipleOf: 0.001
 *           example: 10
 *         unit_price:
 *           type: number
 *           minimum: 0
 *           multipleOf: 0.0001
 *           example: 25
 *         discount_amount:
 *           type: number
 *           minimum: 0
 *           multipleOf: 0.01
 *           default: 0
 *           example: 10
 *
 *     CreateSalesOrder:
 *       type: object
 *       required:
 *         - customer_id
 *         - salesperson_id
 *         - warehouse_id
 *         - details
 *       properties:
 *         customer_id:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         salesperson_id:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         warehouse_id:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         notes:
 *           type: string
 *           nullable: true
 *           maxLength: 500
 *           example: Pedido para entrega en sucursal.
 *         details:
 *           type: array
 *           minItems: 1
 *           items:
 *             $ref: '#/components/schemas/CreateSalesOrderDetail'
 *           example:
 *             - product_id: 1
 *               quantity: 10
 *               unit_price: 25
 *               discount_amount: 10
 *             - product_id: 2
 *               quantity: 5
 *               unit_price: 18.50
 *
 *     UpdateSalesOrder:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         customer_id:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         salesperson_id:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         warehouse_id:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         notes:
 *           type: string
 *           nullable: true
 *           maxLength: 500
 *           example: Pedido actualizado.
 *         details:
 *           type: array
 *           minItems: 1
 *           description: Reemplaza los detalles de la orden en borrador.
 *           items:
 *             $ref: '#/components/schemas/CreateSalesOrderDetail'
 */

/**
 * @openapi
 * /api/sales-orders:
 *   get:
 *     tags: [Órdenes de Venta]
 *     summary: Listar órdenes de venta
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
 *         description: Listado paginado de órdenes de venta.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SALES_ORDER_READ.
 *
 *   post:
 *     tags: [Órdenes de Venta]
 *     summary: Crear orden de venta
 *     description: Crea una orden en estado DRAFT, calcula los importes e impuestos y registra sus detalles sin reservar inventario.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSalesOrder'
 *     responses:
 *       201:
 *         description: Orden de venta creada correctamente.
 *       400:
 *         description: Datos inválidos o registros relacionados inexistentes o inactivos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SALES_ORDER_CREATE.
 *
 * /api/sales-orders/count:
 *   get:
 *     tags: [Órdenes de Venta]
 *     summary: Contar órdenes de venta
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cantidad total de órdenes de venta.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SALES_ORDER_READ.
 *
 * /api/sales-orders/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *         format: int64
 *         minimum: 1
 *   get:
 *     tags: [Órdenes de Venta]
 *     summary: Obtener orden de venta por identificador
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orden de venta encontrada.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SALES_ORDER_READ.
 *       404:
 *         description: Orden de venta no encontrada.
 *
 *   patch:
 *     tags: [Órdenes de Venta]
 *     summary: Actualizar orden de venta
 *     description: Solo permite actualizar órdenes en estado DRAFT. Si se envían detalles, reemplaza los existentes y recalcula los importes.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSalesOrder'
 *     responses:
 *       200:
 *         description: Orden de venta actualizada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SALES_ORDER_UPDATE.
 *       404:
 *         description: Orden de venta no encontrada.
 *       409:
 *         description: La orden no puede modificarse en su estado actual.
 *
 * /api/sales-orders/{id}/details:
 *   get:
 *     tags: [Órdenes de Venta]
 *     summary: Consultar detalles de una orden de venta
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
 *         description: Detalles de la orden de venta.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SALES_ORDER_READ.
 *       404:
 *         description: Orden de venta no encontrada.
 *
 * /api/sales-orders/{id}/submit:
 *   patch:
 *     tags: [Órdenes de Venta]
 *     summary: Enviar orden de venta
 *     description: Cambia una orden de DRAFT a PENDING. La orden debe contener al menos un producto.
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
 *         description: Orden de venta enviada correctamente.
 *       400:
 *         description: La orden no contiene productos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SALES_ORDER_SUBMIT.
 *       404:
 *         description: Orden de venta no encontrada.
 *       409:
 *         description: La orden no se encuentra en estado DRAFT.
 *
 * /api/sales-orders/{id}/approve:
 *   patch:
 *     tags: [Órdenes de Venta]
 *     summary: Aprobar orden de venta
 *     description: Cambia una orden de PENDING a APPROVED. No permite aprobar órdenes con crédito rechazado.
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
 *         description: Orden de venta aprobada correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SALES_ORDER_APPROVE.
 *       404:
 *         description: Orden de venta no encontrada.
 *       409:
 *         description: La orden no está pendiente o tiene crédito rechazado.
 *
 * /api/sales-orders/{id}/reserve:
 *   patch:
 *     tags: [Órdenes de Venta]
 *     summary: Reservar productos de una orden de venta
 *     description: Reserva las cantidades de los productos en el almacén correspondiente y cambia la orden de APPROVED a RESERVED. No permite reservas con crédito rechazado ni existencias insuficientes.
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
 *         description: Productos reservados correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SALES_ORDER_RESERVE.
 *       404:
 *         description: Orden de venta no encontrada.
 *       409:
 *         description: La orden no puede reservarse o no existen suficientes unidades disponibles.
 *
 * /api/sales-orders/{id}/cancel:
 *   patch:
 *     tags: [Órdenes de Venta]
 *     summary: Cancelar orden de venta
 *     description: Cancela una orden que no esté completada ni cancelada. Si tiene productos reservados, libera las cantidades correspondientes.
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
 *         description: Orden de venta cancelada correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SALES_ORDER_CANCEL.
 *       404:
 *         description: Orden de venta no encontrada.
 *       409:
 *         description: La orden ya está cancelada o completada.
 *
 * /api/sales-orders/{id}/approve-credit:
 *   patch:
 *     tags: [Órdenes de Venta]
 *     summary: Autorizar crédito de una orden de venta
 *     description: Autoriza el crédito de una orden PENDING. Verifica que el cliente esté activo, tenga crédito habilitado y que el importe de la orden no supere su límite de crédito.
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
 *         description: Crédito autorizado correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SALES_ORDER_CREDIT_APPROVE.
 *       404:
 *         description: Orden de venta no encontrada.
 *       409:
 *         description: La orden no permite autorización o el cliente no cumple las condiciones crediticias.
 *
 * /api/sales-orders/{id}/reject-credit:
 *   patch:
 *     tags: [Órdenes de Venta]
 *     summary: Rechazar crédito de una orden de venta
 *     description: Cambia el estado crediticio de PENDING a REJECTED. Solo permite rechazar crédito de órdenes de venta pendientes.
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
 *         description: Crédito rechazado correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SALES_ORDER_CREDIT_REJECT.
 *       404:
 *         description: Orden de venta no encontrada.
 *       409:
 *         description: La orden no tiene una autorización crediticia pendiente o su estado no permite rechazarla.
 */

export {};
