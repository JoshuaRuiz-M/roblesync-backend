/**
 * @openapi
 * tags:
 *   - name: Lotes de Producto
 *     description: Administración de lotes de productos del sistema.
 *
 * components:
 *   schemas:
 *     ProductBatch:
 *       type: object
 *       properties:
 *         batch_id:
 *           type: integer
 *           example: 1
 *         product_id:
 *           type: integer
 *           example: 1
 *         batch_number:
 *           type: string
 *           example: LOT-2026-001
 *         manufacturing_date:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2026-10-01"
 *         expiration_date:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2027-10-01"
 *         is_active:
 *           type: boolean
 *           example: true
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
 *     CreateProductBatch:
 *       type: object
 *       additionalProperties: false
 *       required:
 *         - product_id
 *         - batch_number
 *       properties:
 *         product_id:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         batch_number:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           example: LOT-2026-001
 *         manufacturing_date:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2026-10-01"
 *         expiration_date:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2027-10-01"
 *         is_active:
 *           type: boolean
 *           default: true
 *           example: true
 *
 *     UpdateProductBatch:
 *       type: object
 *       additionalProperties: false
 *       minProperties: 1
 *       properties:
 *         product_id:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         batch_number:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           example: LOT-2026-002
 *         manufacturing_date:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2026-10-02"
 *         expiration_date:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2027-10-02"
 *         is_active:
 *           type: boolean
 *           example: true
 */

/**
 * @openapi
 * /api/product-batches:
 *   get:
 *     tags: [Lotes de Producto]
 *     summary: Listar lotes de producto
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
 *         description: Listado paginado de lotes de producto.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PRODUCT_BATCH_READ.
 *
 *   post:
 *     tags: [Lotes de Producto]
 *     summary: Crear un lote de producto
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductBatch'
 *     responses:
 *       201:
 *         description: Lote de producto creado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PRODUCT_BATCH_CREATE.
 *       409:
 *         description: Conflicto al crear el lote de producto.
 *
 * /api/product-batches/count:
 *   get:
 *     tags: [Lotes de Producto]
 *     summary: Contar lotes de producto
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cantidad total de lotes de producto.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PRODUCT_BATCH_READ.
 *
 * /api/product-batches/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *         minimum: 1
 *
 *   get:
 *     tags: [Lotes de Producto]
 *     summary: Obtener lote de producto por identificador
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lote de producto encontrado.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PRODUCT_BATCH_READ.
 *       404:
 *         description: Lote de producto no encontrado.
 *
 *   patch:
 *     tags: [Lotes de Producto]
 *     summary: Actualizar un lote de producto
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductBatch'
 *     responses:
 *       200:
 *         description: Lote de producto actualizado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PRODUCT_BATCH_UPDATE.
 *       404:
 *         description: Lote de producto no encontrado.
 *       409:
 *         description: Conflicto al actualizar el lote de producto.
 *
 *   delete:
 *     tags: [Lotes de Producto]
 *     summary: Eliminar un lote de producto
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Lote de producto eliminado correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PRODUCT_BATCH_DELETE.
 *       404:
 *         description: Lote de producto no encontrado.
 *       409:
 *         description: El lote de producto tiene relaciones que impiden eliminarlo.
 */

export {};
