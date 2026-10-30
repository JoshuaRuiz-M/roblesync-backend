/**
 * @openapi
 * tags:
 *   - name: Transferencias entre Bodegas
 *     description: Administración de transferencias de inventario entre bodegas del sistema.
 *
 * components:
 *   schemas:
 *     WarehouseTransfer:
 *       type: object
 *       properties:
 *         warehouse_transfer_id:
 *           type: integer
 *           format: int64
 *           example: 1
 *         transfer_number:
 *           type: string
 *           example: TR-000001
 *         source_warehouse_id:
 *           type: integer
 *           example: 1
 *         destination_warehouse_id:
 *           type: integer
 *           example: 2
 *         transfer_date:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [DRAFT, IN_TRANSIT, RECEIVED, CANCELLED]
 *           example: DRAFT
 *         dispatched_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         dispatched_by:
 *           type: integer
 *           nullable: true
 *         received_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         received_by:
 *           type: integer
 *           nullable: true
 *         notes:
 *           type: string
 *           nullable: true
 *           maxLength: 500
 *           example: Traslado de productos para abastecimiento de sucursal.
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
 *     WarehouseTransferDetail:
 *       type: object
 *       properties:
 *         warehouse_transfer_detail_id:
 *           type: integer
 *           format: int64
 *           example: 1
 *         warehouse_transfer_id:
 *           type: integer
 *           format: int64
 *           example: 1
 *         product_id:
 *           type: integer
 *           example: 5
 *         batch_id:
 *           type: integer
 *           example: 12
 *         quantity:
 *           type: number
 *           exclusiveMinimum: 0
 *           multipleOf: 0.001
 *           example: 20
 *         unit_cost:
 *           type: number
 *           minimum: 0
 *           multipleOf: 0.0001
 *           description: Costo unitario calculado automáticamente durante el despacho.
 *           example: 15.5000
 *         created_at:
 *           type: string
 *           format: date-time
 *         created_by:
 *           type: integer
 *
 *     CreateWarehouseTransferDetail:
 *       type: object
 *       additionalProperties: false
 *       required:
 *         - product_id
 *         - batch_id
 *         - quantity
 *       properties:
 *         product_id:
 *           type: integer
 *           minimum: 1
 *           example: 5
 *         batch_id:
 *           type: integer
 *           minimum: 1
 *           example: 12
 *         quantity:
 *           type: number
 *           exclusiveMinimum: 0
 *           multipleOf: 0.001
 *           example: 20
 *
 *     CreateWarehouseTransfer:
 *       type: object
 *       additionalProperties: false
 *       required:
 *         - source_warehouse_id
 *         - destination_warehouse_id
 *         - details
 *       properties:
 *         source_warehouse_id:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         destination_warehouse_id:
 *           type: integer
 *           minimum: 1
 *           description: Debe ser diferente de la bodega de origen.
 *           example: 2
 *         notes:
 *           type: string
 *           nullable: true
 *           maxLength: 500
 *           example: Traslado de productos para abastecimiento de sucursal.
 *         details:
 *           type: array
 *           minItems: 1
 *           description: Productos y lotes que se transferirán.
 *           items:
 *             $ref: '#/components/schemas/CreateWarehouseTransferDetail'
 *           example:
 *             - product_id: 5
 *               batch_id: 12
 *               quantity: 20
 *             - product_id: 8
 *               batch_id: 15
 *               quantity: 10
 *
 *     UpdateWarehouseTransfer:
 *       type: object
 *       additionalProperties: false
 *       minProperties: 1
 *       properties:
 *         source_warehouse_id:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         destination_warehouse_id:
 *           type: integer
 *           minimum: 1
 *           example: 3
 *         notes:
 *           type: string
 *           nullable: true
 *           maxLength: 500
 *           example: Transferencia actualizada para abastecimiento.
 *         details:
 *           type: array
 *           minItems: 1
 *           description: Reemplaza todos los detalles existentes de la transferencia en borrador.
 *           items:
 *             $ref: '#/components/schemas/CreateWarehouseTransferDetail'
 */

/**
 * @openapi
 * /api/warehouse-transfers:
 *   get:
 *     tags: [Transferencias entre Bodegas]
 *     summary: Listar transferencias entre bodegas
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
 *         description: Listado paginado de transferencias entre bodegas.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso WAREHOUSE_TRANSFERS_READ.
 *
 *   post:
 *     tags: [Transferencias entre Bodegas]
 *     summary: Crear transferencia entre bodegas
 *     description: Crea una transferencia en estado DRAFT con sus detalles. Genera automáticamente el número de transferencia y no modifica las existencias del inventario.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWarehouseTransfer'
 *     responses:
 *       201:
 *         description: Transferencia creada correctamente.
 *       400:
 *         description: Datos inválidos, bodegas iguales, productos o lotes inexistentes o inactivos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso WAREHOUSE_TRANSFERS_CREATE.
 *
 * /api/warehouse-transfers/count:
 *   get:
 *     tags: [Transferencias entre Bodegas]
 *     summary: Contar transferencias entre bodegas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cantidad total de transferencias entre bodegas.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso WAREHOUSE_TRANSFERS_READ.
 *
 * /api/warehouse-transfers/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *         format: int64
 *         minimum: 1
 *   get:
 *     tags: [Transferencias entre Bodegas]
 *     summary: Obtener transferencia por identificador
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transferencia encontrada.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso WAREHOUSE_TRANSFERS_READ.
 *       404:
 *         description: Transferencia no encontrada.
 *
 *   patch:
 *     tags: [Transferencias entre Bodegas]
 *     summary: Actualizar transferencia entre bodegas
 *     description: Solo permite actualizar transferencias en estado DRAFT. Si se proporcionan detalles, reemplaza todos los existentes. No modifica inventario.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateWarehouseTransfer'
 *     responses:
 *       200:
 *         description: Transferencia actualizada correctamente.
 *       400:
 *         description: Datos inválidos, bodegas iguales o registros relacionados inexistentes o inactivos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso WAREHOUSE_TRANSFERS_UPDATE.
 *       404:
 *         description: Transferencia no encontrada.
 *       409:
 *         description: La transferencia no puede modificarse en su estado actual.
 *
 * /api/warehouse-transfers/{id}/details:
 *   get:
 *     tags: [Transferencias entre Bodegas]
 *     summary: Consultar detalles de una transferencia
 *     description: Obtiene los productos, lotes, cantidades y costos unitarios de una transferencia.
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
 *         description: Detalles de la transferencia.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso WAREHOUSE_TRANSFERS_READ.
 *       404:
 *         description: Transferencia no encontrada.
 *
 * /api/warehouse-transfers/{id}/dispatch:
 *   patch:
 *     tags: [Transferencias entre Bodegas]
 *     summary: Despachar transferencia entre bodegas
 *     description: Cambia una transferencia de DRAFT a IN_TRANSIT. Valida las existencias disponibles por producto y lote, calcula el costo unitario, descuenta las cantidades de la bodega de origen y registra movimientos TRANSFER_OUT. La operación es transaccional.
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
 *         description: Transferencia despachada correctamente.
 *       400:
 *         description: La transferencia no contiene productos válidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso WAREHOUSE_TRANSFERS_DISPATCH.
 *       404:
 *         description: Transferencia no encontrada.
 *       409:
 *         description: La transferencia no está en DRAFT, alguna bodega está inactiva o existen cantidades insuficientes para realizar el despacho.
 *
 * /api/warehouse-transfers/{id}/receive:
 *   patch:
 *     tags: [Transferencias entre Bodegas]
 *     summary: Recibir transferencia entre bodegas
 *     description: Cambia una transferencia de IN_TRANSIT a RECEIVED. Incrementa las existencias de la bodega de destino, conserva los costos unitarios registrados durante el despacho y genera movimientos TRANSFER_IN. La operación es transaccional.
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
 *         description: Transferencia recibida correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso WAREHOUSE_TRANSFERS_RECEIVE.
 *       404:
 *         description: Transferencia no encontrada.
 *       409:
 *         description: La transferencia no está en IN_TRANSIT, la bodega de destino está inactiva o existe una inconsistencia de inventario.
 *
 * /api/warehouse-transfers/{id}/cancel:
 *   patch:
 *     tags: [Transferencias entre Bodegas]
 *     summary: Cancelar transferencia entre bodegas
 *     description: Cancela una transferencia en estado DRAFT y cambia su estado a CANCELLED. No modifica existencias ni permite cancelar transferencias despachadas o recibidas.
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
 *         description: Transferencia cancelada correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso WAREHOUSE_TRANSFERS_CANCEL.
 *       404:
 *         description: Transferencia no encontrada.
 *       409:
 *         description: La transferencia no se encuentra en estado DRAFT.
 */

export {};
