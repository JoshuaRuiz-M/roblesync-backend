
INSERT INTO security.users (
    username,
    email,
    password_hash,
    first_name,
    last_name,
    is_active
)
VALUES (
    'joshua',
    'joshua@example.com',
    '$argon2id$v=19$m=19456,p=1,t=2$CGWLrCM/4skP6UmgEbQ0Bw$d0SgIZqSolti7B0dH0pgL8VdbDnnJRQ1yUolqwuW1h0',
    'Joshua',
    'Ruiz',
    1
);


INSERT INTO security.roles (
    code,
    name,
    description,
    is_active
)
VALUES (
    'ADMIN',
    'Administrador',
    'Rol administrativo con acceso a las funciones autorizadas del sistema.',
    1
)

INSERT INTO security.user_roles (
    user_id,
    role_id
)
VALUES (1, 1);



INSERT INTO security.permissions (
    code,
    name,
    description,
    is_active
)
VALUES
    ('ROLE_READ', 'Consultar roles', 'Permite consultar los roles del sistema.', 1),
    ('ROLE_CREATE', 'Crear roles', 'Permite registrar nuevos roles.', 1),
    ('ROLE_UPDATE', 'Actualizar roles', 'Permite modificar roles existentes.', 1),
    ('ROLE_DELETE', 'Eliminar roles', 'Permite eliminar roles del sistema.', 1),
    ('ROLE_MENU_READ', 'Consultar menús de roles', 'Permite consultar las opciones de menú asignadas a un rol.', 1),
    ('ROLE_MENU_SYNC', 'Asignar menús a roles', 'Permite modificar las opciones de menú asignadas a un rol.', 1),
    ('ROLE_PERMISSION_READ', 'Consultar permisos de roles', 'Permite consultar los permisos asignados a un rol.', 1),
    ('ROLE_PERMISSION_SYNC', 'Asignar permisos a roles', 'Permite modificar los permisos asignados a un rol.', 1);


INSERT INTO security.role_permissions (
    role_id,
    permission_id
)
VALUES (1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8);



INSERT INTO security.permissions (
    code,
    name,
    description,
    is_active
)
VALUES
    ('MENU_ITEM_READ', 'Consultar menús', 'Permite consultar las opciones de menú.', 1),
    ('MENU_ITEM_CREATE', 'Crear menús', 'Permite crear opciones de menú.', 1),
    ('MENU_ITEM_UPDATE', 'Actualizar menús', 'Permite modificar opciones de menú.', 1),
    ('MENU_ITEM_DELETE', 'Eliminar menús', 'Permite eliminar opciones de menú.', 1);

INSERT INTO security.role_permissions (
    role_id,
    permission_id
)
VALUES (1, 9), (1, 10), (1, 11), (1, 12);


INSERT INTO security.permissions (
    code,
    name,
    description,
    is_active
)
VALUES
    ('USER_READ', 'Consultar usuarios', 'Permite consultar los usuarios del sistema.', 1),
    ('USER_CREATE', 'Crear usuarios', 'Permite registrar nuevos usuarios.', 1),
    ('USER_UPDATE', 'Actualizar usuarios', 'Permite modificar usuarios y asignar roles.', 1),
    ('USER_DELETE', 'Eliminar usuarios', 'Permite eliminar usuarios del sistema.', 1),
    ('USER_ROLE_READ', 'Consultar roles de usuarios', 'Permite consultar los roles asignados a un usuario.', 1),
    ('USER_ROLE_SYNC', 'Asignar roles a usuarios', 'Permite modificar los roles asignados a un usuario.', 1),
    ('USER_MENU_READ', 'Consultar menús de usuarios', 'Permite consultar el menú jerárquico asignado a un usuario.', 1);

INSERT INTO security.role_permissions (
    role_id,
    permission_id
)
VALUES (1, 13), (1, 14), (1, 15), (1, 16), (1, 17), (1, 18), (1, 19);

INSERT INTO security.permissions (
    code,
    name,
    description,
    is_active
)
VALUES
    ('PERMISSION_READ', 'Consultar permisos', 'Permite consultar los permisos del sistema.', 1),
    ('PERMISSION_CREATE', 'Crear permisos', 'Permite registrar nuevos permisos.', 1),
    ('PERMISSION_UPDATE', 'Actualizar permisos', 'Permite modificar los permisos del sistema.', 1),
    ('PERMISSION_DELETE', 'Eliminar permisos', 'Permite eliminar permisos del sistema.', 1);

INSERT INTO security.role_permissions (
    role_id,
    permission_id
)
VALUES (1, 20), (1, 21), (1, 22), (1, 23);



-- Opciones principales
INSERT INTO navigation.menu_items (
    parent_id,
    code,
    label,
    path,
    icon,
    sort_order,
    is_active,
    created_at,
    updated_at
)
VALUES
(NULL, 'SECURITY', 'Seguridad', NULL, 'pi pi-shield', 1, 1, SYSDATETIME(), NULL),
(NULL, 'CATALOGS', 'Catálogos', NULL, 'pi pi-box', 2, 1, SYSDATETIME(), NULL),
(NULL, 'REPORTS', 'Reportes', '/reports', 'pi pi-chart-bar', 3, 1, SYSDATETIME(), NULL);
GO

-- Submenús de Seguridad
INSERT INTO navigation.menu_items (
    parent_id,
    code,
    label,
    path,
    icon,
    sort_order,
    is_active,
    created_at,
    updated_at
)
SELECT
    parent.menu_item_id,
    items.code,
    items.label,
    items.path,
    items.icon,
    items.sort_order,
    1,
    SYSDATETIME(),
    NULL
FROM navigation.menu_items AS parent
CROSS JOIN (
    VALUES
        ('USERS', 'Usuarios', '/users', 'pi pi-users', 1),
        ('ROLES', 'Roles', '/roles', 'pi pi-id-card', 2),
        ('PERMISSIONS', 'Permisos', '/permissions', 'pi pi-key', 3),
        ('MENU_ITEMS', 'Opciones de menú', '/menu-items', 'pi pi-list', 4)
) AS items(code, label, path, icon, sort_order)
WHERE parent.code = 'SECURITY';
GO

INSERT INTO navigation.role_menu_items (role_id, menu_item_id)
VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7)