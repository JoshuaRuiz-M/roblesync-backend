/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Iniciar sesión
 *     description: Autentica al usuario y devuelve un token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso.
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: Credenciales incorrectas.
 *       429:
 *         description: Demasiados intentos de inicio de sesión.
 *
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Autenticación
 *     summary: Obtener usuario autenticado
 *     description: Devuelve la información del usuario autenticado.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario autenticado.
 *       401:
 *         description: Token inválido o expirado.
 *
 * /api/auth/menu:
 *   get:
 *     tags: [Autenticación]
 *     summary: Obtener menú del usuario autenticado
 *     description: Devuelve las opciones de menú activas correspondientes a los roles activos del usuario autenticado, organizadas jerárquicamente para su uso en el frontend.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Menú jerárquico del usuario autenticado.
 *       401:
 *         description: No autenticado o usuario inactivo.
 *
 * /api/auth/me/password:
 *   patch:
 *     tags:
 *       - Autenticación
 *     summary: Cambiar contraseña del usuario autenticado
 *     description: Permite al usuario autenticado cambiar su contraseña mediante la verificación de su contraseña actual.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: false
 *             required:
 *               - current_password
 *               - new_password
 *             properties:
 *               current_password:
 *                 type: string
 *                 format: password
 *                 description: Contraseña actual del usuario.
 *                 example: "ContrasenaActual123!"
 *               new_password:
 *                 type: string
 *                 format: password
 *                 minLength: 12
 *                 maxLength: 128
 *                 description: Nueva contraseña. Debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial.
 *                 example: "NuevaContrasena456!"
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente.
 *       400:
 *         description: Datos inválidos, contraseña actual incorrecta o nueva contraseña igual a la anterior.
 *       401:
 *         description: Token inválido, expirado o usuario inactivo.
 *       409:
 *         description: No se pudo actualizar la contraseña porque las credenciales cambiaron durante la operación.
 *       429:
 *         description: Demasiados intentos de cambio de contraseña.
 */

export {};
