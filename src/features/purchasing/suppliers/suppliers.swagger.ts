/**
 * @openapi
 * tags:
 *   - name: Proveedores
 *     description: Administración de proveedores del sistema.
 *
 * components:
 *   schemas:
 *     Supplier:
 *       type: object
 *       properties:
 *         supplier_id:
 *           type: integer
 *           example: 1
 *         tax_id:
 *           type: string
 *           example: 12345678
 *         business_name:
 *           type: string
 *           example: Proveedor S.A.
 *         contact_name:
 *           type: string
 *           nullable: true
 *         phone:
 *           type: string
 *           nullable: true
 *         email:
 *           type: string
 *           nullable: true
 *         address:
 *           type: string
 *           nullable: true
 *         credit_days:
 *           type: integer
 *           example: 30
 *         credit_limit:
 *           type: number
 *           format: float
 *           example: 10000.50
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
 *     CreateSupplier:
 *       type: object
 *       required:
 *         - tax_id
 *         - business_name
 *       properties:
 *         tax_id:
 *           type: string
 *           maxLength: 20
 *           example: 12345678
 *         business_name:
 *           type: string
 *           maxLength: 200
 *           example: Proveedor S.A.
 *         contact_name:
 *           type: string
 *           maxLength: 200
 *           example: Juan Pérez
 *         phone:
 *           type: string
 *           maxLength: 30
 *           example: 1234567890
 *         email:
 *           type: string
 *           maxLength: 255
 *           example: juan.perez@example.com
 *         address:
 *           type: string
 *           maxLength: 300
 *           example: Calle Falsa 123
 *         credit_days:
 *           type: integer
 *           example: 30
 *         credit_limit:
 *           type: number
 *           format: float
 *           example: 10000.50
 *         is_active:
 *           type: boolean
 *           default: true
 *
 *     UpdateSupplier:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         tax_id:
 *           type: string
 *           maxLength: 20
 *         business_name:
 *           type: string
 *           maxLength: 200
 *         contact_name:
 *           type: string
 *           maxLength: 150
 *           nullable: true
 *         phone:
 *           type: string
 *           maxLength: 30
 *           nullable: true
 *         email:
 *           type: string
 *           maxLength: 255
 *           nullable: true
 *         address:
 *           type: string
 *           maxLength: 300
 *           nullable: true
 *         credit_days:
 *           type: integer
 *           example: 30
 *         credit_limit:
 *           type: number
 *           format: float
 *           example: 10000.50
 *         is_active:
 *           type: boolean
 */

/**
 * @openapi
 * /api/suppliers:
 *   get:
 *     tags: [Proveedores]
 *     summary: Listar proveedores
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
 *         description: Listado paginado de proveedores.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SUPPLIER_READ.
 *
 *   post:
 *     tags: [Proveedores]
 *     summary: Crear un proveedor
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSupplier'
 *     responses:
 *       201:
 *         description: Proveedor creado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SUPPLIER_CREATE.
 *       409:
 *         description: Código de proveedor duplicado.
 *
 * /api/suppliers/count:
 *   get:
 *     tags: [Proveedores]
 *     summary: Contar proveedores
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cantidad total de proveedores.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SUPPLIER_READ.
 *
 * /api/suppliers/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *         minimum: 1
 *   get:
 *     tags: [Proveedores]
 *     summary: Obtener proveedor por identificador
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Proveedor encontrado.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SUPPLIER_READ.
 *       404:
 *         description: Proveedor no encontrado.
 *
 *   patch:
 *     tags: [Proveedores]
 *     summary: Actualizar un proveedor
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSupplier'
 *     responses:
 *       200:
 *         description: Proveedor actualizado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SUPPLIER_UPDATE.
 *       404:
 *         description: Proveedor no encontrado.
 *       409:
 *         description: Código de proveedor duplicado.
 *
 *   delete:
 *     tags: [Proveedores]
 *     summary: Eliminar un proveedor
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Proveedor eliminado correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SUPPLIER_DELETE.
 *       404:
 *         description: Proveedor no encontrado.
 *       409:
 *         description: El proveedor tiene relaciones que impiden eliminarlo.
 */

export {};
