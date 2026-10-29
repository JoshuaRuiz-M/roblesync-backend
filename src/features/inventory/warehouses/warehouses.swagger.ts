/**
 * @openapi
 * tags:
 *   - name: Bodegas
 *     description: Administración de bodegas del sistema.
 *
 * components:
 *   schemas:
 *     Warehouse:
 *       type: object
 *       properties:
 *         warehouse_id:
 *           type: integer
 *           example: 1
 *         code:
 *           type: string
 *           example: BOD-001
 *         name:
 *           type: string
 *           example: Bodega Central
 *         description:
 *           type: string
 *           nullable: true
 *           example: Bodega principal para almacenamiento de productos.
 *         address:
 *           type: string
 *           nullable: true
 *           example: Zona 1, Ciudad de Guatemala
 *         is_active:
 *           type: boolean
 *           example: true
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
 *           nullable: true
 *           example: 1
 *
 *     CreateWarehouse:
 *       type: object
 *       additionalProperties: false
 *       required:
 *         - code
 *         - name
 *       properties:
 *         code:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           example: BOD-001
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 150
 *           example: Bodega Central
 *         description:
 *           type: string
 *           maxLength: 500
 *           nullable: true
 *           example: Bodega principal para almacenamiento de productos.
 *         address:
 *           type: string
 *           maxLength: 300
 *           nullable: true
 *           example: Zona 1, Ciudad de Guatemala
 *         is_active:
 *           type: boolean
 *           default: true
 *
 *     UpdateWarehouse:
 *       type: object
 *       additionalProperties: false
 *       minProperties: 1
 *       properties:
 *         code:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           example: BOD-002
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 150
 *           example: Bodega Secundaria
 *         description:
 *           type: string
 *           maxLength: 500
 *           nullable: true
 *         address:
 *           type: string
 *           maxLength: 300
 *           nullable: true
 *         is_active:
 *           type: boolean
 */

/**
 * @openapi
 * /api/warehouses:
 *   get:
 *     tags: [Bodegas]
 *     summary: Listar bodegas
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
 *         description: Listado paginado de bodegas.
 *       400:
 *         description: Parámetros de paginación inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso WAREHOUSE_READ.
 *
 *   post:
 *     tags: [Bodegas]
 *     summary: Crear una bodega
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWarehouse'
 *     responses:
 *       201:
 *         description: Bodega creada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso WAREHOUSE_CREATE.
 *       409:
 *         description: Código de bodega duplicado.
 *
 * /api/warehouses/count:
 *   get:
 *     tags: [Bodegas]
 *     summary: Contar bodegas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cantidad total de bodegas.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso WAREHOUSE_READ.
 *
 * /api/warehouses/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *         minimum: 1
 *   get:
 *     tags: [Bodegas]
 *     summary: Obtener bodega por identificador
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bodega encontrada.
 *       400:
 *         description: Identificador inválido.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso WAREHOUSE_READ.
 *       404:
 *         description: Bodega no encontrada.
 *
 *   patch:
 *     tags: [Bodegas]
 *     summary: Actualizar una bodega
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateWarehouse'
 *     responses:
 *       200:
 *         description: Bodega actualizada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso WAREHOUSE_UPDATE.
 *       404:
 *         description: Bodega no encontrada.
 *       409:
 *         description: Código de bodega duplicado.
 *
 *   delete:
 *     tags: [Bodegas]
 *     summary: Eliminar una bodega
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Bodega eliminada correctamente.
 *       400:
 *         description: Identificador inválido.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso WAREHOUSE_DELETE.
 *       404:
 *         description: Bodega no encontrada.
 *       409:
 *         description: La bodega tiene relaciones que impiden eliminarla.
 */

export {};
