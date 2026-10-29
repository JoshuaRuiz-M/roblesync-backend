/**
 * @openapi
 * tags:
 *   - name: Marcas
 *     description: Administración de marcas del sistema.
 *
 * components:
 *   schemas:
 *     Brand:
 *       type: object
 *       properties:
 *         brand_id:
 *           type: integer
 *           example: 1
 *         code:
 *           type: string
 *           example: Fanta
 *         name:
 *           type: string
 *           example: Fanta
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
 *     CreateBrand:
 *       type: object
 *       required:
 *         - code
 *         - name
 *       properties:
 *         code:
 *           type: string
 *           maxLength: 50
 *           example: Fanta
 *         name:
 *           type: string
 *           maxLength: 150
 *           example: Fanta
 *         description:
 *           type: string
 *           maxLength: 500
 *           nullable: true
 *         is_active:
 *           type: boolean
 *           default: true
 *
 *     UpdateBrand:
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
 * /api/brands:
 *   get:
 *     tags: [Marcas]
 *     summary: Listar marcas
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
 *         description: Listado paginado de marcas.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso BRAND_READ.
 *
 *   post:
 *     tags: [Marcas]
 *     summary: Crear una marca
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBrand'
 *     responses:
 *       201:
 *         description: Marca creada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso BRAND_CREATE.
 *       409:
 *         description: Código de marca duplicado.
 *
 * /api/brands/count:
 *   get:
 *     tags: [Marcas]
 *     summary: Contar marcas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cantidad total de marcas.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso BRAND_READ.
 *
 * /api/brands/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *         minimum: 1
 *   get:
 *     tags: [Marcas]
 *     summary: Obtener marca por identificador
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Marca encontrada.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso BRAND_READ.
 *       404:
 *         description: Marca no encontrada.
 *
 *   patch:
 *     tags: [Marcas]
 *     summary: Actualizar una marca
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBrand'
 *     responses:
 *       200:
 *         description: Marca actualizada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso BRAND_UPDATE.
 *       404:
 *         description: Marca no encontrada.
 *       409:
 *         description: Código de marca duplicado.
 *
 *   delete:
 *     tags: [Marcas]
 *     summary: Eliminar una marca
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Marca eliminada correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso BRAND_DELETE.
 *       404:
 *         description: Marca no encontrada.
 *       409:
 *         description: La marca tiene relaciones que impiden eliminarla.
 */

export {};
