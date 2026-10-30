/**
 * @openapi
 * tags:
 *   - name: Productos
 *     description: Administración de productos y sus proveedores asociados.
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
 *
 *     ProductSupplier:
 *       type: object
 *       properties:
 *         product_supplier_id:
 *           type: integer
 *           example: 1
 *         product_id:
 *           type: integer
 *           example: 1
 *         supplier_id:
 *           type: integer
 *           example: 3
 *         is_preferred:
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
 *
 *     ProductSupplierDetail:
 *       allOf:
 *         - $ref: '#/components/schemas/ProductSupplier'
 *         - type: object
 *           properties:
 *             tax_id:
 *               type: string
 *               example: "1234567-8"
 *             business_name:
 *               type: string
 *               example: Distribuidora Central S.A.
 *             contact_name:
 *               type: string
 *               nullable: true
 *               example: Juan Pérez
 *             phone:
 *               type: string
 *               nullable: true
 *               example: "55551234"
 *             email:
 *               type: string
 *               nullable: true
 *               example: ventas@distribuidora.com
 *
 *     CreateProductSupplier:
 *       type: object
 *       additionalProperties: false
 *       required:
 *         - supplier_id
 *       properties:
 *         supplier_id:
 *           type: integer
 *           minimum: 1
 *           example: 3
 *         is_preferred:
 *           type: boolean
 *           default: false
 *           example: false
 *         is_active:
 *           type: boolean
 *           default: true
 *           example: true
 *
 *     UpdateProductSupplier:
 *       type: object
 *       additionalProperties: false
 *       minProperties: 1
 *       properties:
 *         is_preferred:
 *           type: boolean
 *           example: true
 *         is_active:
 *           type: boolean
 *           example: true
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
 *
 * /api/products/{id}/suppliers:
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
 *     summary: Consultar proveedores asociados a un producto
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Proveedores asociados al producto.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductSupplierDetail'
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PRODUCT_SUPPLIER_READ.
 *       404:
 *         description: Producto no encontrado.
 *
 *   post:
 *     tags: [Productos]
 *     summary: Asociar un proveedor a un producto
 *     description: Crea una asociación o reactiva una asociación inactiva.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductSupplier'
 *     responses:
 *       201:
 *         description: Proveedor asociado correctamente.
 *       400:
 *         description: Datos inválidos o proveedor inactivo.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PRODUCT_SUPPLIER_MANAGE.
 *       404:
 *         description: Producto o proveedor no encontrado.
 *       409:
 *         description: El proveedor ya está asociado al producto.
 *
 * /api/products/{id}/suppliers/{supplierId}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *         minimum: 1
 *     - in: path
 *       name: supplierId
 *       required: true
 *       schema:
 *         type: integer
 *         minimum: 1
 *
 *   patch:
 *     tags: [Productos]
 *     summary: Actualizar un proveedor asociado a un producto
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductSupplier'
 *     responses:
 *       200:
 *         description: Asociación actualizada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PRODUCT_SUPPLIER_MANAGE.
 *       404:
 *         description: Producto o asociación no encontrada.
 *       409:
 *         description: Conflicto al actualizar la asociación.
 *
 *   delete:
 *     tags: [Productos]
 *     summary: Desasociar un proveedor de un producto
 *     description: Desactiva la asociación sin eliminar el registro.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Proveedor desasociado correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PRODUCT_SUPPLIER_MANAGE.
 *       404:
 *         description: Asociación no encontrada.
 *
 * /api/products/{id}/suppliers/{supplierId}/preferred:
 *   patch:
 *     tags: [Productos]
 *     summary: Establecer proveedor preferido de un producto
 *     description: Establece el proveedor preferido y desmarca al anterior.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: path
 *         name: supplierId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Proveedor preferido actualizado correctamente.
 *       400:
 *         description: El proveedor o la asociación está inactiva.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PRODUCT_SUPPLIER_MANAGE.
 *       404:
 *         description: Producto o asociación no encontrada.
 *       409:
 *         description: Conflicto al establecer el proveedor preferido.
 */

export {};
