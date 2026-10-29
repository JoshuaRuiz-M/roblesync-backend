/**
 * @openapi
 * tags:
 *   - name: Líneas de Producto
 *     description: Administración de líneas de productos del sistema.
 *
 * components:
 *   schemas:
 *     ProductLine:
 *       type: object
 *       properties:
 *         product_line_id:
 *           type: integer
 *           example: 1
 *         category_id:
 *           type: integer
 *           example: 1
 *         code:
 *           type: string
 *           example: ENLATADOS
 *         name:
 *           type: string
 *           example: Sardinas
 *         description:
 *           type: string
 *           nullable: true
 *         is_active:
 *           type: boolean
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         created_by:
 *           type: integer
 *           example: 1
 *         updated_by:
 *           type: integer
 *           example: 1
 *
 *     CreateProductLine:
 *       type: object
 *       required:
 *         - code
 *         - name
 *       properties:
 *         code:
 *           type: string
 *           maxLength: 50
 *           example: ENLATADOS
 *         name:
 *           type: string
 *           maxLength: 150
 *           example: Sardinas
 *         description:
 *           type: string
 *           maxLength: 500
 *           nullable: true
 *         is_active:
 *           type: boolean
 *           default: true
 *
 *     UpdateProductLine:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         code:
 *           type: string
 *           maxLength: 150
 *         name:
 *           type: string
 *           maxLength: 150
 *         description:
 *           type: string
 *           maxLength: 500
 *           nullable: true
 *         is_active:
 *           type: boolean
 */

/**
 * @openapi
 * /api/product-lines:
 *   get:
 *     tags: [Líneas de Producto]
 *     summary: Listar líneas de producto
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
 *         description: Listado paginado de líneas de producto.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PRODUCT_LINE_READ.
 *
 *   post:
 *     tags: [Líneas de Producto]
 *     summary: Crear una línea de producto
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductLine'
 *     responses:
 *       201:
 *         description: Línea de producto creada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PRODUCT_LINE_CREATE.
 *       409:
 *         description: Código de línea de producto duplicado.
 *
 * /api/product-lines/count:
 *   get:
 *     tags: [Líneas de Producto]
 *     summary: Contar líneas de producto
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cantidad total de líneas de producto.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PRODUCT_LINE_READ.
 *
 * /api/product-lines/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *         minimum: 1
 *   get:
 *     tags: [Líneas de Producto]
 *     summary: Obtener línea de producto por identificador
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Línea de producto encontrada.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PRODUCT_LINE_READ.
 *       404:
 *         description: Línea de producto no encontrada.
 *
 *   patch:
 *     tags: [Líneas de Producto]
 *     summary: Actualizar una línea de producto
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductLine'
 *     responses:
 *       200:
 *         description: Línea de producto actualizada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PRODUCT_LINE_UPDATE.
 *       404:
 *         description: Línea de producto no encontrada.
 *       409:
 *         description: Código de línea de producto duplicado.
 *
 *   delete:
 *     tags: [Líneas de Producto]
 *     summary: Eliminar una línea de producto
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Línea de producto eliminada correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PRODUCT_LINE_DELETE.
 *       404:
 *         description: Línea de producto no encontrada.
 *       409:
 *         description: La línea de producto tiene relaciones que impiden eliminarla.
 */

export {};
