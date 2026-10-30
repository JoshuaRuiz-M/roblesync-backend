/**
 * @openapi
 * tags:
 *   - name: Recepciones de Mercancías
 *     description: Administración de recepciones de mercancías del sistema.
 *
 * components:
 *   schemas:
 *     GoodsReceipt:
 *       type: object
 *       properties:
 *         goods_receipt_id:
 *           type: integer
 *           format: int64
 *           example: 1
 *         receipt_number:
 *           type: string
 *           example: REC-00000001
 *         purchase_order_id:
 *           type: integer
 *           format: int64
 *           example: 1
 *         warehouse_id:
 *           type: integer
 *           example: 1
 *         receipt_date:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [DRAFT, CONFIRMED, CANCELLED]
 *           example: DRAFT
 *         notes:
 *           type: string
 *           nullable: true
 *           maxLength: 500
 *         confirmed_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         confirmed_by:
 *           type: integer
 *           nullable: true
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
 *     GoodsReceiptDetail:
 *       type: object
 *       properties:
 *         goods_receipt_detail_id:
 *           type: integer
 *           format: int64
 *           example: 1
 *         goods_receipt_id:
 *           type: integer
 *           format: int64
 *           example: 1
 *         purchase_order_id:
 *           type: integer
 *           format: int64
 *           example: 1
 *         purchase_order_detail_id:
 *           type: integer
 *           format: int64
 *           example: 1
 *         batch_id:
 *           type: integer
 *           format: int64
 *           example: 1
 *         product_id:
 *           type: integer
 *           example: 1
 *         quantity_received:
 *           type: number
 *           exclusiveMinimum: 0
 *           multipleOf: 0.001
 *           example: 20
 *         unit_cost:
 *           type: number
 *           minimum: 0
 *           multipleOf: 0.0001
 *           example: 5.25
 *         created_at:
 *           type: string
 *           format: date-time
 *         created_by:
 *           type: integer
 *
 *     CreateGoodsReceiptDetail:
 *       type: object
 *       required:
 *         - purchase_order_detail_id
 *         - quantity_received
 *       properties:
 *         purchase_order_detail_id:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         quantity_received:
 *           type: number
 *           exclusiveMinimum: 0
 *           multipleOf: 0.001
 *           example: 20
 *         batch_number:
 *           type: string
 *           nullable: true
 *           minLength: 1
 *           maxLength: 100
 *           description: Número de lote del fabricante. Si se omite, se genera automáticamente.
 *           example: FAN-2026-001
 *         manufacturing_date:
 *           type: string
 *           format: date
 *           nullable: true
 *           example: "2026-09-15"
 *         expiration_date:
 *           type: string
 *           format: date
 *           nullable: true
 *           example: "2027-09-15"
 *
 *     CreateGoodsReceipt:
 *       type: object
 *       required:
 *         - purchase_order_id
 *         - warehouse_id
 *         - details
 *       properties:
 *         purchase_order_id:
 *           type: integer
 *           format: int64
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
 *           example: Recepción parcial de mercancías
 *         details:
 *           type: array
 *           minItems: 1
 *           items:
 *             $ref: '#/components/schemas/CreateGoodsReceiptDetail'
 *           example:
 *             - purchase_order_detail_id: 1
 *               quantity_received: 20
 *               batch_number: FAN-2026-001
 *               expiration_date: "2027-09-15"
 *             - purchase_order_detail_id: 2
 *               quantity_received: 15
 *
 *     UpdateGoodsReceipt:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         warehouse_id:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         notes:
 *           type: string
 *           nullable: true
 *           maxLength: 500
 *           example: Recepción actualizada
 *         details:
 *           type: array
 *           minItems: 1
 *           description: Reemplaza los detalles de la recepción en borrador.
 *           items:
 *             $ref: '#/components/schemas/CreateGoodsReceiptDetail'
 */

/**
 * @openapi
 * /api/goods-receipts:
 *   get:
 *     tags: [Recepciones de Mercancías]
 *     summary: Listar recepciones de mercancías
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
 *         description: Listado paginado de recepciones.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso GOODS_RECEIPT_READ.
 *
 *   post:
 *     tags: [Recepciones de Mercancías]
 *     summary: Crear recepción de mercancías
 *     description: Crea una recepción en estado DRAFT y registra automáticamente los lotes necesarios sin modificar las existencias.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateGoodsReceipt'
 *     responses:
 *       201:
 *         description: Recepción creada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso GOODS_RECEIPT_CREATE.
 *       404:
 *         description: Orden de compra no encontrada.
 *       409:
 *         description: La orden no permite recepciones o se superan las cantidades pendientes.
 *
 * /api/goods-receipts/count:
 *   get:
 *     tags: [Recepciones de Mercancías]
 *     summary: Contar recepciones de mercancías
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cantidad total de recepciones.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso GOODS_RECEIPT_READ.
 *
 * /api/goods-receipts/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *         format: int64
 *         minimum: 1
 *   get:
 *     tags: [Recepciones de Mercancías]
 *     summary: Obtener recepción por identificador
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recepción encontrada.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso GOODS_RECEIPT_READ.
 *       404:
 *         description: Recepción no encontrada.
 *
 *   patch:
 *     tags: [Recepciones de Mercancías]
 *     summary: Actualizar recepción de mercancías
 *     description: Solo permite actualizar recepciones en estado DRAFT.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateGoodsReceipt'
 *     responses:
 *       200:
 *         description: Recepción actualizada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso GOODS_RECEIPT_UPDATE.
 *       404:
 *         description: Recepción no encontrada.
 *       409:
 *         description: La recepción no puede modificarse.
 *
 * /api/goods-receipts/{id}/details:
 *   get:
 *     tags: [Recepciones de Mercancías]
 *     summary: Consultar detalles de una recepción
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
 *         description: Detalles de la recepción.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso GOODS_RECEIPT_READ.
 *       404:
 *         description: Recepción no encontrada.
 *
 * /api/goods-receipts/{id}/confirm:
 *   patch:
 *     tags: [Recepciones de Mercancías]
 *     summary: Confirmar recepción de mercancías
 *     description: Confirma una recepción en estado DRAFT, actualiza las existencias por almacén y lote, registra movimientos de inventario y actualiza el estado de la orden de compra.
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
 *         description: Recepción confirmada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso GOODS_RECEIPT_CONFIRM.
 *       404:
 *         description: Recepción no encontrada.
 *       409:
 *         description: La recepción no puede confirmarse.
 *
 * /api/goods-receipts/{id}/cancel:
 *   patch:
 *     tags: [Recepciones de Mercancías]
 *     summary: Cancelar recepción de mercancías
 *     description: Cancela una recepción en estado DRAFT sin modificar las existencias.
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
 *         description: Recepción cancelada correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso GOODS_RECEIPT_CANCEL.
 *       404:
 *         description: Recepción no encontrada.
 *       409:
 *         description: Solo pueden cancelarse recepciones en borrador.
 */

export {};
