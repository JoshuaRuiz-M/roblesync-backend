/**
 * @openapi
 * tags:
 *   - name: Listas de Precios
 *     description: Administración de listas de precios y sus productos.
 *
 * components:
 *   schemas:
 *     PriceList:
 *       type: object
 *       properties:
 *         price_list_id:
 *           type: integer
 *           example: 1
 *         code:
 *           type: string
 *           maxLength: 50
 *           example: MAYORISTA
 *         name:
 *           type: string
 *           maxLength: 150
 *           example: Precios Mayoristas
 *         description:
 *           type: string
 *           nullable: true
 *           maxLength: 500
 *           example: Lista de precios para clientes mayoristas
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
 *     PriceListDetail:
 *       type: object
 *       properties:
 *         price_list_detail_id:
 *           type: integer
 *           example: 1
 *         price_list_id:
 *           type: integer
 *           example: 1
 *         product_id:
 *           type: integer
 *           example: 1
 *         unit_price:
 *           type: number
 *           minimum: 0
 *           multipleOf: 0.0001
 *           example: 125.50
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
 *     CreatePriceListDetail:
 *       type: object
 *       required:
 *         - product_id
 *         - unit_price
 *       properties:
 *         product_id:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         unit_price:
 *           type: number
 *           minimum: 0
 *           multipleOf: 0.0001
 *           example: 125.50
 *
 *     CreatePriceList:
 *       type: object
 *       required:
 *         - code
 *         - name
 *         - details
 *       properties:
 *         code:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           example: MAYORISTA
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 150
 *           example: Precios Mayoristas
 *         description:
 *           type: string
 *           nullable: true
 *           maxLength: 500
 *           example: Lista de precios para clientes mayoristas
 *         is_active:
 *           type: boolean
 *           default: true
 *           example: true
 *         details:
 *           type: array
 *           minItems: 1
 *           description: Productos y precios asociados a la lista.
 *           items:
 *             $ref: '#/components/schemas/CreatePriceListDetail'
 *           example:
 *             - product_id: 1
 *               unit_price: 125.50
 *             - product_id: 2
 *               unit_price: 85.75
 *
 *     UpdatePriceList:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         code:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           example: MAYORISTA
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 150
 *           example: Precios Mayoristas Actualizados
 *         description:
 *           type: string
 *           nullable: true
 *           maxLength: 500
 *           example: Lista de precios actualizada
 *         is_active:
 *           type: boolean
 *           example: true
 *         details:
 *           type: array
 *           description: Si se proporciona, reemplaza todos los detalles actuales. Un arreglo vacío elimina todos los productos de la lista.
 *           items:
 *             $ref: '#/components/schemas/CreatePriceListDetail'
 *           example:
 *             - product_id: 1
 *               unit_price: 120.00
 *             - product_id: 3
 *               unit_price: 95.50
 */

/**
 * @openapi
 * /api/price-lists:
 *   get:
 *     tags: [Listas de Precios]
 *     summary: Listar listas de precios
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
 *         description: Listado paginado de listas de precios.
 *       400:
 *         description: Parámetros de paginación inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PRICE_LIST_READ.
 *
 *   post:
 *     tags: [Listas de Precios]
 *     summary: Crear lista de precios
 *     description: Crea una lista de precios y registra sus productos en una única transacción.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePriceList'
 *     responses:
 *       201:
 *         description: Lista de precios creada correctamente.
 *       400:
 *         description: Datos inválidos, productos inexistentes o productos duplicados.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PRICE_LIST_CREATE.
 *       409:
 *         description: Ya existe una lista de precios con el código proporcionado.
 *
 * /api/price-lists/count:
 *   get:
 *     tags: [Listas de Precios]
 *     summary: Contar listas de precios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cantidad total de listas de precios.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PRICE_LIST_READ.
 *
 * /api/price-lists/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *         minimum: 1
 *   get:
 *     tags: [Listas de Precios]
 *     summary: Obtener lista de precios por identificador
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de precios encontrada.
 *       400:
 *         description: Identificador inválido.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PRICE_LIST_READ.
 *       404:
 *         description: Lista de precios no encontrada.
 *
 *   patch:
 *     tags: [Listas de Precios]
 *     summary: Actualizar lista de precios
 *     description: Actualiza la cabecera y, si se proporcionan detalles, reemplaza los productos y precios existentes dentro de una transacción.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePriceList'
 *     responses:
 *       200:
 *         description: Lista de precios actualizada correctamente.
 *       400:
 *         description: Datos inválidos, productos inexistentes o productos duplicados.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PRICE_LIST_UPDATE.
 *       404:
 *         description: Lista de precios no encontrada.
 *       409:
 *         description: Conflicto con el código de otra lista de precios.
 *
 *   delete:
 *     tags: [Listas de Precios]
 *     summary: Eliminar lista de precios
 *     description: Elimina primero los detalles y posteriormente la lista de precios mediante una transacción controlada por el backend.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Lista de precios y sus detalles eliminados correctamente.
 *       400:
 *         description: Identificador inválido.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PRICE_LIST_DELETE.
 *       404:
 *         description: Lista de precios no encontrada.
 *       409:
 *         description: No se puede eliminar la lista porque existen otras relaciones que lo impiden.
 *
 * /api/price-lists/{id}/details:
 *   get:
 *     tags: [Listas de Precios]
 *     summary: Consultar detalles de una lista de precios
 *     description: Obtiene los productos y sus precios asociados a una lista.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Detalles de la lista de precios.
 *       400:
 *         description: Identificador inválido.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso PRICE_LIST_READ.
 *       404:
 *         description: Lista de precios no encontrada.
 */

export {};
