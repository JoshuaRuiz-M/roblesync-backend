/**
 * @openapi
 * tags:
 *   - name: Clientes
 *     description: Administración de clientes del sistema.
 *
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       properties:
 *         customer_id:
 *           type: integer
 *           example: 1
 *         customer_code:
 *           type: string
 *           example: CLI-001
 *         tax_id:
 *           type: string
 *           example: "1234567-8"
 *         business_name:
 *           type: string
 *           example: Distribuidora El Progreso, S.A.
 *         customer_type:
 *           type: string
 *           enum: [WHOLESALE, RETAIL, CHAIN]
 *           example: WHOLESALE
 *         contact_name:
 *           type: string
 *           nullable: true
 *           example: Juan Pérez
 *         phone:
 *           type: string
 *           nullable: true
 *           example: "55551234"
 *         email:
 *           type: string
 *           format: email
 *           nullable: true
 *           example: contacto@distribuidora.com
 *         address:
 *           type: string
 *           nullable: true
 *           example: Zona 1, Chiquimula, Guatemala
 *         salesperson_id:
 *           type: integer
 *           example: 1
 *         price_list_id:
 *           type: integer
 *           example: 1
 *         credit_days:
 *           type: integer
 *           example: 30
 *         credit_limit:
 *           type: number
 *           example: 15000.00
 *         is_credit_blocked:
 *           type: boolean
 *           example: false
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
 *     CreateCustomer:
 *       type: object
 *       additionalProperties: false
 *       required:
 *         - customer_code
 *         - tax_id
 *         - business_name
 *         - salesperson_id
 *         - price_list_id
 *         - credit_days
 *         - credit_limit
 *         - is_credit_blocked
 *       properties:
 *         customer_code:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           example: CLI-001
 *         tax_id:
 *           type: string
 *           minLength: 1
 *           maxLength: 20
 *           example: "1234567-8"
 *         business_name:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *           example: Distribuidora El Progreso, S.A.
 *         customer_type:
 *           type: string
 *           enum: [WHOLESALE, RETAIL, CHAIN]
 *           default: RETAIL
 *           example: WHOLESALE
 *         contact_name:
 *           type: string
 *           maxLength: 150
 *           nullable: true
 *           example: Juan Pérez
 *         phone:
 *           type: string
 *           maxLength: 30
 *           nullable: true
 *           example: "55551234"
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 255
 *           nullable: true
 *           example: contacto@distribuidora.com
 *         address:
 *           type: string
 *           maxLength: 300
 *           nullable: true
 *           example: Zona 1, Chiquimula, Guatemala
 *         salesperson_id:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         price_list_id:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         credit_days:
 *           type: integer
 *           minimum: 0
 *           example: 30
 *         credit_limit:
 *           type: number
 *           minimum: 0
 *           example: 15000.00
 *         is_credit_blocked:
 *           type: boolean
 *           example: false
 *         is_active:
 *           type: boolean
 *           default: true
 *           example: true
 *
 *     UpdateCustomer:
 *       type: object
 *       additionalProperties: false
 *       minProperties: 1
 *       properties:
 *         customer_code:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           example: CLI-002
 *         tax_id:
 *           type: string
 *           minLength: 1
 *           maxLength: 20
 *           example: "1234567-8"
 *         business_name:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *           example: Distribuidora El Progreso, S.A.
 *         customer_type:
 *           type: string
 *           enum: [WHOLESALE, RETAIL, CHAIN]
 *           example: RETAIL
 *         contact_name:
 *           type: string
 *           maxLength: 150
 *           nullable: true
 *           example: María López
 *         phone:
 *           type: string
 *           maxLength: 30
 *           nullable: true
 *           example: "55554321"
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 255
 *           nullable: true
 *           example: ventas@distribuidora.com
 *         address:
 *           type: string
 *           maxLength: 300
 *           nullable: true
 *           example: Zona 2, Chiquimula, Guatemala
 *         salesperson_id:
 *           type: integer
 *           minimum: 1
 *           example: 2
 *         price_list_id:
 *           type: integer
 *           minimum: 1
 *           example: 2
 *         credit_days:
 *           type: integer
 *           minimum: 0
 *           example: 45
 *         credit_limit:
 *           type: number
 *           minimum: 0
 *           example: 20000.00
 *         is_credit_blocked:
 *           type: boolean
 *           example: false
 *         is_active:
 *           type: boolean
 *           example: true
 */

/**
 * @openapi
 * /api/customers:
 *   get:
 *     tags: [Clientes]
 *     summary: Listar clientes
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
 *         description: Listado paginado de clientes.
 *       400:
 *         description: Parámetros de paginación inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso CUSTOMER_READ.
 *
 *   post:
 *     tags: [Clientes]
 *     summary: Crear un cliente
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCustomer'
 *     responses:
 *       201:
 *         description: Cliente creado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso CUSTOMER_CREATE.
 *       404:
 *         description: Vendedor o lista de precios asociada no encontrada.
 *       409:
 *         description: Código de cliente o identificación tributaria duplicada.
 *
 * /api/customers/count:
 *   get:
 *     tags: [Clientes]
 *     summary: Contar clientes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cantidad total de clientes.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso CUSTOMER_READ.
 *
 * /api/customers/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *         minimum: 1
 *   get:
 *     tags: [Clientes]
 *     summary: Obtener cliente por identificador
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cliente encontrado.
 *       400:
 *         description: Identificador inválido.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso CUSTOMER_READ.
 *       404:
 *         description: Cliente no encontrado.
 *
 *   patch:
 *     tags: [Clientes]
 *     summary: Actualizar un cliente
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCustomer'
 *     responses:
 *       200:
 *         description: Cliente actualizado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso CUSTOMER_UPDATE.
 *       404:
 *         description: Cliente, vendedor o lista de precios asociada no encontrada.
 *       409:
 *         description: Código de cliente o identificación tributaria duplicada.
 *
 *   delete:
 *     tags: [Clientes]
 *     summary: Eliminar un cliente
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Cliente eliminado correctamente.
 *       400:
 *         description: Identificador inválido.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso CUSTOMER_DELETE.
 *       404:
 *         description: Cliente no encontrado.
 *       409:
 *         description: El cliente tiene relaciones que impiden eliminarlo.
 */

export {};
