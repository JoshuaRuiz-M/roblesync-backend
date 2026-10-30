/**
 * @openapi
 * tags:
 *   - name: Órdenes de Compra
 *     description: Administración de órdenes de compra y sus detalles.
 *
 * components:
 *   schemas:
 *     PurchaseOrderStatus:
 *       type: string
 *       enum:
 *         - DRAFT
 *         - APPROVED
 *         - PARTIALLY_RECEIVED
 *         - RECEIVED
 *         - CANCELLED
 *       example: DRAFT
 *
 *     PurchaseOrderDetail:
 *       type: object
 *       properties:
 *         purchase_order_detail_id:
 *           type: integer
 *           format: int64
 *           example: 1
 *         purchase_order_id:
 *           type: integer
 *           format: int64
 *           example: 1
 *         product_id:
 *           type: integer
 *           example: 10
 *         quantity:
 *           type: number
 *           format: double
 *           example: 100
 *         unit_cost:
 *           type: number
 *           format: double
 *           example: 8.50
 *         discount_amount:
 *           type: number
 *           format: double
 *           example: 50.00
 *         subtotal:
 *           type: number
 *           format: double
 *           example: 800.00
 *         tax_amount:
 *           type: number
 *           format: double
 *           example: 96.00
 *         total_amount:
 *           type: number
 *           format: double
 *           example: 896.00
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
 *           example: 1
 *
 *     PurchaseOrder:
 *       type: object
 *       properties:
 *         purchase_order_id:
 *           type: integer
 *           format: int64
 *           example: 1
 *         order_number:
 *           type: string
 *           example: OC-000001
 *         supplier_id:
 *           type: integer
 *           example: 3
 *         order_date:
 *           type: string
 *           format: date-time
 *           example: "2026-10-29T15:30:00.000Z"
 *         expected_date:
 *           type: string
 *           format: date
 *           nullable: true
 *           example: "2026-11-15"
 *         status:
 *           $ref: '#/components/schemas/PurchaseOrderStatus'
 *         subtotal:
 *           type: number
 *           format: double
 *           example: 1550.00
 *         tax_amount:
 *           type: number
 *           format: double
 *           example: 186.00
 *         total_amount:
 *           type: number
 *           format: double
 *           example: 1736.00
 *         notes:
 *           type: string
 *           nullable: true
 *           maxLength: 500
 *           example: Entrega en bodega central.
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
 *           example: 1
 *
 *     PurchaseOrderWithDetails:
 *       allOf:
 *         - $ref: '#/components/schemas/PurchaseOrder'
 *         - type: object
 *           required:
 *             - details
 *           properties:
 *             details:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PurchaseOrderDetail'
 *
 *     CreatePurchaseOrderDetail:
 *       type: object
 *       additionalProperties: false
 *       required:
 *         - product_id
 *         - quantity
 *         - unit_cost
 *       properties:
 *         product_id:
 *           type: integer
 *           minimum: 1
 *           example: 10
 *         quantity:
 *           type: number
 *           format: double
 *           exclusiveMinimum: 0
 *           multipleOf: 0.001
 *           example: 100
 *         unit_cost:
 *           type: number
 *           format: double
 *           minimum: 0
 *           multipleOf: 0.0001
 *           description: Costo unitario sin IVA.
 *           example: 8.50
 *         discount_amount:
 *           type: number
 *           format: double
 *           minimum: 0
 *           multipleOf: 0.01
 *           default: 0
 *           description: Descuento monetario aplicado a la línea.
 *           example: 50.00
 *
 *     CreatePurchaseOrder:
 *       type: object
 *       additionalProperties: false
 *       required:
 *         - supplier_id
 *         - details
 *       properties:
 *         supplier_id:
 *           type: integer
 *           minimum: 1
 *           example: 3
 *         expected_date:
 *           type: string
 *           format: date
 *           nullable: true
 *           example: "2026-11-15"
 *         notes:
 *           type: string
 *           maxLength: 500
 *           nullable: true
 *           example: Entrega en bodega central.
 *         details:
 *           type: array
 *           minItems: 1
 *           description: Los productos no pueden repetirse dentro de una misma orden.
 *           items:
 *             $ref: '#/components/schemas/CreatePurchaseOrderDetail'
 *           example:
 *             - product_id: 10
 *               quantity: 100
 *               unit_cost: 8.50
 *               discount_amount: 50
 *             - product_id: 15
 *               quantity: 50
 *               unit_cost: 15
 *               discount_amount: 0
 *
 *     UpdatePurchaseOrder:
 *       type: object
 *       additionalProperties: false
 *       minProperties: 1
 *       description: Solo se pueden actualizar órdenes en estado DRAFT. Si se envía details, se reemplaza el conjunto completo de detalles.
 *       properties:
 *         supplier_id:
 *           type: integer
 *           minimum: 1
 *           example: 3
 *         expected_date:
 *           type: string
 *           format: date
 *           nullable: true
 *           example: "2026-11-20"
 *         notes:
 *           type: string
 *           maxLength: 500
 *           nullable: true
 *           example: Entregar durante la mañana.
 *         details:
 *           type: array
 *           minItems: 1
 *           items:
 *             $ref: '#/components/schemas/CreatePurchaseOrderDetail'
 */

/**
 * @openapi
 * /api/purchase-orders:
 *   get:
 *     tags: [Órdenes de Compra]
 *     summary: Listar órdenes de compra
 *     description: Obtiene las órdenes de compra de forma paginada, sin incluir sus detalles.
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
 *         description: Listado paginado de órdenes de compra.
 *       400:
 *         description: Parámetros de paginación inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PURCHASE_ORDER_READ.
 *
 *   post:
 *     tags: [Órdenes de Compra]
 *     summary: Crear una orden de compra
 *     description: |
 *       Crea una orden de compra en estado DRAFT junto con sus detalles.
 *       El backend genera el número de orden y calcula los importes.
 *       El costo unitario se interpreta sin IVA y se aplica inicialmente un IVA del 12%.
 *       Todos los productos deben estar activos y asociados al proveedor.
 *       La operación se ejecuta dentro de una transacción.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePurchaseOrder'
 *           example:
 *             supplier_id: 3
 *             expected_date: "2026-11-15"
 *             notes: Entrega en bodega central.
 *             details:
 *               - product_id: 10
 *                 quantity: 100
 *                 unit_cost: 8.50
 *                 discount_amount: 50
 *               - product_id: 15
 *                 quantity: 50
 *                 unit_cost: 15
 *                 discount_amount: 0
 *     responses:
 *       201:
 *         description: Orden de compra creada correctamente.
 *       400:
 *         description: Datos inválidos, productos inactivos o productos no asociados al proveedor.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PURCHASE_ORDER_CREATE.
 *       409:
 *         description: Conflicto con una restricción de la base de datos.
 *
 * /api/purchase-orders/count:
 *   get:
 *     tags: [Órdenes de Compra]
 *     summary: Contar órdenes de compra
 *     description: Obtiene la cantidad total de órdenes registradas.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cantidad total de órdenes de compra.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PURCHASE_ORDER_READ.
 *
 * /api/purchase-orders/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       description: Identificador de la orden de compra.
 *       schema:
 *         type: integer
 *         format: int64
 *         minimum: 1
 *       example: 1
 *
 *   get:
 *     tags: [Órdenes de Compra]
 *     summary: Obtener una orden de compra por identificador
 *     description: Devuelve la cabecera de la orden junto con todos sus detalles.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orden de compra encontrada.
 *       400:
 *         description: Identificador inválido.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PURCHASE_ORDER_READ.
 *       404:
 *         description: Orden de compra no encontrada.
 *
 *   patch:
 *     tags: [Órdenes de Compra]
 *     summary: Actualizar una orden de compra
 *     description: |
 *       Permite modificar una orden únicamente en estado DRAFT.
 *       Si se envía details, se reemplazan todos los detalles anteriores.
 *       Los importes se recalculan automáticamente.
 *       Si cambia el proveedor, los productos deben estar asociados al nuevo proveedor.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePurchaseOrder'
 *           example:
 *             expected_date: "2026-11-20"
 *             notes: Entrega programada para la mañana.
 *             details:
 *               - product_id: 10
 *                 quantity: 120
 *                 unit_cost: 8.50
 *                 discount_amount: 50
 *               - product_id: 15
 *                 quantity: 40
 *                 unit_cost: 15
 *                 discount_amount: 0
 *     responses:
 *       200:
 *         description: Orden de compra actualizada correctamente.
 *       400:
 *         description: Datos inválidos o productos no asociados al proveedor.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PURCHASE_ORDER_UPDATE.
 *       404:
 *         description: Orden de compra no encontrada.
 *       409:
 *         description: La orden no está en estado DRAFT.
 *
 * /api/purchase-orders/{id}/approve:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *         format: int64
 *         minimum: 1
 *       example: 1
 *
 *   patch:
 *     tags: [Órdenes de Compra]
 *     summary: Aprobar una orden de compra
 *     description: |
 *       Cambia el estado de DRAFT a APPROVED.
 *       Verifica que la orden contenga productos y que el proveedor
 *       y sus productos estén activos y correctamente asociados.
 *       La aprobación no modifica las existencias del inventario.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orden de compra aprobada correctamente.
 *       400:
 *         description: La orden no contiene productos o sus datos no cumplen las reglas de negocio.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PURCHASE_ORDER_APPROVE.
 *       404:
 *         description: Orden de compra no encontrada.
 *       409:
 *         description: La orden no está en estado DRAFT.
 *
 * /api/purchase-orders/{id}/cancel:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *         format: int64
 *         minimum: 1
 *       example: 1
 *
 *   patch:
 *     tags: [Órdenes de Compra]
 *     summary: Cancelar una orden de compra
 *     description: |
 *       Cambia el estado de la orden a CANCELLED.
 *       Actualmente se permite cancelar órdenes en estado DRAFT o APPROVED.
 *       No se eliminan físicamente los registros.
 *       Las órdenes parcialmente recibidas o recibidas no pueden
 *       cancelarse mediante esta operación.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orden de compra cancelada correctamente.
 *       400:
 *         description: Identificador inválido.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PURCHASE_ORDER_CANCEL.
 *       404:
 *         description: Orden de compra no encontrada.
 *       409:
 *         description: El estado actual de la orden no permite cancelarla.
 */

export {};
