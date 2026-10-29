/**
 * @openapi
 * tags:
 *   - name: Productos
 *     description: Administración de productos del sistema.
 *
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         product_id:
 *           type: integer
 *           example: 1
 *         brand_id:
 *           type: integer
 *           example: 1
 *         product_line_id:
 *           type: integer
 *           example: 1
 *         unit_of_measure_id:
 *           type: integer
 *           example: 1
 *         sku:
 *           type: string
 *           maxLength: 50
 *           example: FANTA-ORANGE-600ML
 *         barcode:
 *           type: string
 *           maxLength: 50
 *           example: "7401234567890"
 *         name:
 *           type: string
 *           maxLength: 200
 *           example: Fanta Naranja 600 ml
 *         description:
 *           type: string
 *           maxLength: 1000
 *           nullable: true
 *           example: Bebida gaseosa sabor naranja.
 *         weight:
 *           type: number
 *           nullable: true
 *           example: 0.6
 *         average_cost:
 *           type: number
 *           example: 4.50
 *         list_price:
 *           type: number
 *           example: 7.00
 *         minimum_stock:
 *           type: number
 *           example: 10
 *         maximum_stock:
 *           type: number
 *           example: 100
 *         reorder_point:
 *           type: number
 *           example: 20
 *         tracks_expiration:
 *           type: boolean
 *           example: true
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
 *     CreateProduct:
 *       type: object
 *       additionalProperties: false
 *       required:
 *         - brand_id
 *         - product_line_id
 *         - unit_of_measure_id
 *         - sku
 *         - barcode
 *         - name
 *         - average_cost
 *         - list_price
 *         - minimum_stock
 *         - maximum_stock
 *         - reorder_point
 *         - tracks_expiration
 *         - is_active
 *       properties:
 *         brand_id:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         product_line_id:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         unit_of_measure_id:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         sku:
 *           type: string
 *           maxLength: 50
 *           example: FANTA-ORANGE-600ML
 *         barcode:
 *           type: string
 *           maxLength: 50
 *           example: "7401234567890"
 *         name:
 *           type: string
 *           maxLength: 200
 *           example: Fanta Naranja 600 ml
 *         description:
 *           type: string
 *           maxLength: 1000
 *           example: Bebida gaseosa sabor naranja.
 *         weight:
 *           type: number
 *           example: 0.6
 *         average_cost:
 *           type: number
 *           exclusiveMinimum: 0
 *           example: 4.50
 *         list_price:
 *           type: number
 *           exclusiveMinimum: 0
 *           example: 7.00
 *         minimum_stock:
 *           type: number
 *           exclusiveMinimum: 0
 *           example: 10
 *         maximum_stock:
 *           type: number
 *           exclusiveMinimum: 0
 *           example: 100
 *         reorder_point:
 *           type: number
 *           exclusiveMinimum: 0
 *           example: 20
 *         tracks_expiration:
 *           type: boolean
 *           example: true
 *         is_active:
 *           type: boolean
 *           example: true
 *
 *     UpdateProduct:
 *       type: object
 *       additionalProperties: false
 *       minProperties: 1
 *       properties:
 *         brand_id:
 *           type: integer
 *           minimum: 1
 *         product_line_id:
 *           type: integer
 *           minimum: 1
 *         unit_of_measure_id:
 *           type: integer
 *           minimum: 1
 *         sku:
 *           type: string
 *           maxLength: 50
 *         barcode:
 *           type: string
 *           maxLength: 50
 *         name:
 *           type: string
 *           maxLength: 200
 *         description:
 *           type: string
 *           maxLength: 1000
 *         weight:
 *           type: number
 *         average_cost:
 *           type: number
 *           exclusiveMinimum: 0
 *         list_price:
 *           type: number
 *           exclusiveMinimum: 0
 *         minimum_stock:
 *           type: number
 *           exclusiveMinimum: 0
 *         maximum_stock:
 *           type: number
 *           exclusiveMinimum: 0
 *         reorder_point:
 *           type: number
 *           exclusiveMinimum: 0
 *         tracks_expiration:
 *           type: boolean
 *         is_active:
 *           type: boolean
 */

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags: [Productos]
 *     summary: Listar productos
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
 *         description: Listado paginado de productos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PRODUCT_READ.
 *
 *   post:
 *     tags: [Productos]
 *     summary: Crear un producto
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProduct'
 *     responses:
 *       201:
 *         description: Producto creado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PRODUCT_CREATE.
 *       409:
 *         description: Conflicto al crear el producto.
 *
 * /api/products/count:
 *   get:
 *     tags: [Productos]
 *     summary: Contar productos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cantidad total de productos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PRODUCT_READ.
 *
 * /api/products/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *         minimum: 1
 *
 *   get:
 *     tags: [Productos]
 *     summary: Obtener producto por identificador
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Producto encontrado.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PRODUCT_READ.
 *       404:
 *         description: Producto no encontrado.
 *
 *   patch:
 *     tags: [Productos]
 *     summary: Actualizar un producto
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProduct'
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PRODUCT_UPDATE.
 *       404:
 *         description: Producto no encontrado.
 *       409:
 *         description: Conflicto al actualizar el producto.
 *
 *   delete:
 *     tags: [Productos]
 *     summary: Eliminar un producto
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Producto eliminado correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PRODUCT_DELETE.
 *       404:
 *         description: Producto no encontrado.
 *       409:
 *         description: El producto tiene relaciones que impiden eliminarlo.
 */

export {};
