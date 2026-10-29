/**
 * @openapi
 * tags:
 *   - name: Unidades de medida
 *     description: Administración de unidades de medida del sistema.
 *
 * components:
 *   schemas:
 *     UnitOfMeasure:
 *       type: object
 *       properties:
 *         unit_of_measure_id:
 *           type: integer
 *           example: 1
 *         code:
 *           type: string
 *           example: UNIT
 *         name:
 *           type: string
 *           example: Unidad
 *         abbreviation:
 *           type: string
 *           example: Und
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
 *     CreateUnitOfMeasure:
 *       type: object
 *       required:
 *         - code
 *         - name
 *       properties:
 *         code:
 *           type: string
 *           maxLength: 50
 *           example: UNIT
 *         name:
 *           type: string
 *           maxLength: 150
 *           example: Unidad
 *         abbreviation:
 *           type: string
 *           maxLength: 50
 *           example: Und
 *         description:
 *           type: string
 *           maxLength: 500
 *           nullable: true
 *         is_active:
 *           type: boolean
 *           default: true
 *
 *     UpdateUnitOfMeasure:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         code:
 *           type: string
 *           maxLength: 150
 *         name:
 *           type: string
 *           maxLength: 150
 *         abbreviation:
 *          type: string
 *          maxLength: 50
 *         description:
 *           type: string
 *           maxLength: 500
 *           nullable: true
 *         is_active:
 *           type: boolean
 */

/**
 * @openapi
 * /api/units-of-measure:
 *   get:
 *     tags: [Unidades de medida]
 *     summary: Listar unidades de medida
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
 *         description: Listado paginado de unidades de medida.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso UNIT_OF_MEASURE_READ.
 *
 *   post:
 *     tags: [Unidades de medida]
 *     summary: Crear una unidad de medida
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUnitOfMeasure'
 *     responses:
 *       201:
 *         description: Unidad de medida creada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso UNIT_OF_MEASURE_CREATE.
 *       409:
 *         description: Código de unidad de medida duplicado.
 *
 * /api/units-of-measure/count:
 *   get:
 *     tags: [Unidades de medida]
 *     summary: Contar unidades de medida
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cantidad total de unidades de medida.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso UNIT_OF_MEASURE_READ.
 *
 * /api/units-of-measure/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *         minimum: 1
 *   get:
 *     tags: [Unidades de medida]
 *     summary: Obtener unidad de medida por identificador
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unidad de medida encontrada.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso UNIT_OF_MEASURE_READ.
 *       404:
 *         description: Unidad de medida no encontrada.
 *
 *   patch:
 *     tags: [Unidades de medida]
 *     summary: Actualizar una unidad de medida
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUnitOfMeasure'
 *     responses:
 *       200:
 *         description: Unidad de medida actualizada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso UNIT_OF_MEASURE_UPDATE.
 *       404:
 *         description: Unidad de medida no encontrada.
 *       409:
 *         description: Código de unidad de medida duplicado.
 *
 *   delete:
 *     tags: [Unidades de medida]
 *     summary: Eliminar una unidad de medida
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Unidad de medida eliminada correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso UNIT_OF_MEASURE_DELETE.
 *       404:
 *         description: Unidad de medida no encontrada.
 *       409:
 *         description: La unidad de medidaf tiene relaciones que impiden eliminarla.
 */

export {};
