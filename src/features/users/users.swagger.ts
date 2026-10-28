/**
 * @openapi
 * tags:
 *   - name: Usuarios
 *     description: Administración de usuarios del sistema.
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *           example: 1
 *         username:
 *           type: string
 *           example: joshua
 *         email:
 *           type: string
 *           format: email
 *           example: joshua@example.com
 *         first_name:
 *           type: string
 *           example: Joshua
 *         last_name:
 *           type: string
 *           example: López
 *         is_active:
 *           type: boolean
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *
 *     CreateUser:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - first_name
 *         - last_name
 *       properties:
 *         username:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           example: joshua
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 255
 *           example: joshua@example.com
 *         password:
 *           type: string
 *           format: password
 *           minLength: 12
 *           maxLength: 128
 *           writeOnly: true
 *         first_name:
 *           type: string
 *           maxLength: 100
 *           example: Joshua
 *         last_name:
 *           type: string
 *           maxLength: 100
 *           example: López
 *         is_active:
 *           type: boolean
 *           default: true
 *
 *     UpdateUser:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         username:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 255
 *         password:
 *           type: string
 *           format: password
 *           minLength: 12
 *           maxLength: 128
 *           writeOnly: true
 *         first_name:
 *           type: string
 *           maxLength: 100
 *         last_name:
 *           type: string
 *           maxLength: 100
 *         is_active:
 *           type: boolean
 *
 *     UserRole:
 *       type: object
 *       properties:
 *         role_id:
 *           type: integer
 *           example: 1
 *         code:
 *           type: string
 *           example: ADMIN
 *         name:
 *           type: string
 *           example: Administrador
 *         description:
 *           type: string
 *           nullable: true
 *         is_active:
 *           type: boolean
 */

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags: [Usuarios]
 *     summary: Listar usuarios
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
 *         description: Listado paginado de usuarios.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso USER_READ.
 *
 *   post:
 *     tags: [Usuarios]
 *     summary: Crear un usuario
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       201:
 *         description: Usuario creado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso USER_CREATE.
 *       409:
 *         description: Nombre de usuario o correo electrónico duplicado.
 *
 * /api/users/count:
 *   get:
 *     tags: [Usuarios]
 *     summary: Contar usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cantidad total de usuarios.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso USER_READ.
 *
 * /api/users/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *         minimum: 1
 *   get:
 *     tags: [Usuarios]
 *     summary: Obtener usuario por identificador
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario encontrado.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso USER_READ.
 *       404:
 *         description: Usuario no encontrado.
 *
 *   patch:
 *     tags: [Usuarios]
 *     summary: Actualizar un usuario
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso USER_UPDATE.
 *       404:
 *         description: Usuario no encontrado.
 *       409:
 *         description: Nombre de usuario o correo electrónico duplicado.
 *
 *   delete:
 *     tags: [Usuarios]
 *     summary: Eliminar un usuario
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Usuario eliminado correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso USER_DELETE.
 *       404:
 *         description: Usuario no encontrado.
 *
 * /api/users/{id}/roles:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *         minimum: 1
 *   get:
 *     tags: [Usuarios]
 *     summary: Consultar roles asignados a un usuario
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Roles asignados al usuario.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso USER_ROLE_READ.
 *       404:
 *         description: Usuario no encontrado.
 *
 *   put:
 *     tags: [Usuarios]
 *     summary: Reemplazar roles asignados a un usuario
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role_ids
 *             properties:
 *               role_ids:
 *                 type: array
 *                 uniqueItems: true
 *                 items:
 *                   type: integer
 *                   minimum: 1
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Roles asignados correctamente.
 *       400:
 *         description: Uno o más roles no existen.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso USER_ROLE_SYNC.
 *       404:
 *         description: Usuario no encontrado.
 * /api/users/{id}/menu-items:
 *   get:
 *     tags: [Usuarios]
 *     summary: Consultar menú jerárquico de un usuario
 *     description: Obtiene las opciones de menú activas asignadas mediante los roles activos del usuario, organizadas jerárquicamente para su uso en el frontend.
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
 *         description: Menú jerárquico del usuario.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso USER_MENU_READ.
 *       404:
 *         description: Usuario no encontrado.
 */

export {};
