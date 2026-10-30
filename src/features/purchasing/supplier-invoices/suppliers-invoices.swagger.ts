/**
 * @openapi
 * tags:
 *   - name: Facturas de Proveedores
 *     description: Administración de facturas de proveedores del sistema.
 *
 * components:
 *   schemas:
 *     SupplierInvoice:
 *       type: object
 *       properties:
 *         supplier_invoice_id:
 *           type: integer
 *           example: 1
 *         supplier_id:
 *           type: integer
 *           example: 1
 *         purchase_order_id:
 *           type: integer
 *           example: 1
 *         invoice_number:
 *           type: string
 *           example: FAC-2026-001
 *         invoice_date:
 *           type: string
 *           format: date
 *           example: "2026-10-29"
 *         due_date:
 *           type: string
 *           format: date
 *           example: "2026-11-28"
 *         subtotal:
 *           type: number
 *           format: double
 *           example: 1000.00
 *         tax_amount:
 *           type: number
 *           format: double
 *           example: 120.00
 *         total_amount:
 *           type: number
 *           format: double
 *           example: 1120.00
 *         status:
 *           type: string
 *           enum:
 *             - DRAFT
 *             - SUBMITTED
 *             - APPROVED
 *             - REJECTED
 *             - PAID
 *           example: DRAFT
 *         notes:
 *           type: string
 *           nullable: true
 *           example: Factura correspondiente a la compra de mercadería.
 *         created_at:
 *           type: string
 *           format: date
 *         created_by:
 *           type: integer
 *           example: 1
 *         updated_at:
 *           type: string
 *           format: date
 *           nullable: true
 *         updated_by:
 *           type: integer
 *           nullable: true
 *           example: 1
 *
 *     CreateSupplierInvoice:
 *       type: object
 *       additionalProperties: false
 *       required:
 *         - supplier_id
 *         - purchase_order_id
 *         - invoice_number
 *         - invoice_date
 *         - due_date
 *         - subtotal
 *         - tax_amount
 *         - total_amount
 *         - status
 *       properties:
 *         supplier_id:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         purchase_order_id:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         invoice_number:
 *           type: string
 *           maxLength: 50
 *           example: FAC-2026-001
 *         invoice_date:
 *           type: string
 *           format: date
 *           example: "2026-10-29"
 *         due_date:
 *           type: string
 *           format: date
 *           example: "2026-11-28"
 *         subtotal:
 *           type: number
 *           minimum: 0
 *           example: 1000.00
 *         tax_amount:
 *           type: number
 *           minimum: 0
 *           example: 120.00
 *         total_amount:
 *           type: number
 *           minimum: 0
 *           example: 1120.00
 *         status:
 *           type: string
 *           enum:
 *             - REGISTERED
 *             - CANCELLED
 *           example: REGISTERED
 *         notes:
 *           type: string
 *           maxLength: 500
 *           nullable: true
 *           example: Factura por compra de productos para inventario.
 *
 *     UpdateSupplierInvoice:
 *       type: object
 *       additionalProperties: false
 *       minProperties: 1
 *       properties:
 *         supplier_id:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         purchase_order_id:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         invoice_number:
 *           type: string
 *           maxLength: 50
 *           example: FAC-2026-002
 *         invoice_date:
 *           type: string
 *           format: date
 *         due_date:
 *           type: string
 *           format: date
 *         subtotal:
 *           type: number
 *           minimum: 0
 *           example: 1500.00
 *         tax_amount:
 *           type: number
 *           minimum: 0
 *           example: 180.00
 *         total_amount:
 *           type: number
 *           minimum: 0
 *           example: 1680.00
 *         status:
 *           type: string
 *           enum:
 *             - REGISTERED
 *             - CANCELLED
 *           example: REGISTERED
 *         notes:
 *           type: string
 *           maxLength: 500
 *           nullable: true
 */

/**
 * @openapi
 * /api/supplier-invoices:
 *   get:
 *     tags: [Facturas de Proveedores]
 *     summary: Listar facturas de proveedores
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
 *         description: Listado paginado de facturas de proveedores.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SUPPLIER_INVOICE_READ.
 *
 *   post:
 *     tags: [Facturas de Proveedores]
 *     summary: Crear una factura de proveedor
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSupplierInvoice'
 *     responses:
 *       201:
 *         description: Factura de proveedor creada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SUPPLIER_INVOICE_CREATE.
 *       404:
 *         description: Proveedor u orden de compra no encontrada.
 *       409:
 *         description: Número de factura duplicado.
 *
 * /api/supplier-invoices/count:
 *   get:
 *     tags: [Facturas de Proveedores]
 *     summary: Contar facturas de proveedores
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cantidad total de facturas de proveedores.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SUPPLIER_INVOICE_READ.
 *
 * /api/supplier-invoices/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *         minimum: 1
 *   get:
 *     tags: [Facturas de Proveedores]
 *     summary: Obtener factura de proveedor por identificador
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Factura de proveedor encontrada.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SUPPLIER_INVOICE_READ.
 *       404:
 *         description: Factura de proveedor no encontrada.
 *
 *   patch:
 *     tags: [Facturas de Proveedores]
 *     summary: Actualizar una factura de proveedor
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSupplierInvoice'
 *     responses:
 *       200:
 *         description: Factura de proveedor actualizada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SUPPLIER_INVOICE_UPDATE.
 *       404:
 *         description: Factura, proveedor u orden de compra no encontrada.
 *       409:
 *         description: Número de factura duplicado o conflicto de estado.
 *
 *   delete:
 *     tags: [Facturas de Proveedores]
 *     summary: Eliminar una factura de proveedor
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Factura de proveedor eliminada correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso SUPPLIER_INVOICE_DELETE.
 *       404:
 *         description: Factura de proveedor no encontrada.
 *       409:
 *         description: La factura tiene relaciones o un estado que impide eliminarla.
 */

export {};
