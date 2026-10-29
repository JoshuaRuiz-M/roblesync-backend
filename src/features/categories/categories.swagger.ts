/**
 * @openapi
 * tags:
 *   - name: Categorías
 *     description: Administración de categorías del sistema.
 *
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         category_id:
 *           type: integer
 *           example: 1
 *         code:
 *           type: string
 *           example: LAC
 *         name:
 *           type: string
 *           example: Lacteos
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
 *     CreateCategory:
 *       type: object
 *       required:
 *         - code
 *         - name
 *       properties:
 *         code:
 *           type: string
 *           maxLength: 50
 *           example: LAC
 *         name:
 *           type: string
 *           maxLength: 150
 *           example: Lacteos
 *         description:
 *           type: string
 *           maxLength: 500
 *           nullable: true
 *         is_active:
 *           type: boolean
 *           default: true
 *
 *     UpdateCategory:
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
 * /api/categories:
 *   get:
 *     tags: [Categorías]
 *     summary: Listar categorías
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
 *         description: Listado paginado de categorías.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso CATEGORY_READ.
 *
 *   post:
 *     tags: [Categorías]
 *     summary: Crear una categoría
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategory'
 *     responses:
 *       201:
 *         description: Categoría creada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso CATEGORY_CREATE.
 *       409:
 *         description: Código de categoría duplicado.
 *
 * /api/categories/count:
 *   get:
 *     tags: [Categorías]
 *     summary: Contar categorías
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cantidad total de categorías.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso CATEGORY_READ.
 *
 * /api/categories/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *         minimum: 1
 *   get:
 *     tags: [Categorías]
 *     summary: Obtener categoría por identificador
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categoría encontrada.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso CATEGORY_READ.
 *       404:
 *         description: Categoría no encontrada.
 *
 *   patch:
 *     tags: [Categorías]
 *     summary: Actualizar una categoría
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategory'
 *     responses:
 *       200:
 *         description: Categoría actualizada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso CATEGORY_UPDATE.
 *       404:
 *         description: Categoría no encontrada.
 *       409:
 *         description: Código de categoría duplicado.
 *
 *   delete:
 *     tags: [Categorías]
 *     summary: Eliminar una categoría
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Categoría eliminada correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso CATEGORY_DELETE.
 *       404:
 *         description: Categoría no encontrada.
 *       409:
 *         description: La categoría tiene relaciones que impiden eliminarla.
 */

export {};
