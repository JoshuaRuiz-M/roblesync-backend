<div align="center">

# 🛡️ Backend Core Template

### API REST modular con Node.js, Express, TypeScript y SQL Server

**Una base reutilizable para construir sistemas con autenticación, autorización RBAC y navegación dinámica.**

![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Tipado-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL%20Server-Base%20de%20datos-CC2927?logo=microsoftsqlserver&logoColor=white)
![Knex](https://img.shields.io/badge/Knex-Query%20Builder-D26B38)
![OpenAPI](https://img.shields.io/badge/OpenAPI-Swagger-85EA2D?logo=swagger&logoColor=black)

</div>

---

## 📖 Descripción

**Backend Core Template** es una plantilla de API REST construida para reutilizar la infraestructura común de distintos proyectos. Incluye administración de usuarios, roles, permisos y menús, junto con autenticación JWT, validación de solicitudes y documentación OpenAPI.

La lógica de negocio de cada sistema se agrega mediante nuevas _features_, sin modificar la base de seguridad y navegación.

### ✨ Funcionalidades principales

- 🔐 **Autenticación:** inicio de sesión con JWT y contraseñas protegidas mediante Argon2id.
- 👥 **Usuarios:** operaciones CRUD y asignación de roles.
- 🛡️ **Roles y permisos:** control de acceso basado en roles (**RBAC**).
- 🧭 **Navegación:** administración de menús y asignación de opciones por rol.
- 🌳 **Menú jerárquico:** estructura anidada compatible con los componentes de navegación de Frontend.
- 🧱 **Arquitectura modular:** repositorios, servicios y controladores base reutilizables.
- ✅ **Validaciones:** esquemas Zod para parámetros, consultas y cuerpos HTTP.
- 📚 **Documentación:** Swagger/OpenAPI.
- 📝 **Observabilidad:** logs estructurados con Pino y seguimiento de solicitudes.
- ⚙️ **Seguridad HTTP:** Helmet, CORS y limitación de solicitudes.

## 🧰 Stack tecnológico

| Tecnología                         | Propósito                                      |
| ---------------------------------- | ---------------------------------------------- |
| Node.js                            | Entorno de ejecución                           |
| Express 5                          | Framework HTTP                                 |
| TypeScript                         | Tipado estático                                |
| Microsoft SQL Server               | Persistencia de datos                          |
| Knex                               | Construcción de consultas y transacciones      |
| Zod                                | Validación de entradas y configuración         |
| JOSE                               | Firma y verificación de JWT                    |
| Argon2id                           | Hash de contraseñas                            |
| Pino / pino-http                   | Registro estructurado de eventos y solicitudes |
| Swagger / OpenAPI                  | Documentación de la API                        |
| Helmet / CORS / express-rate-limit | Protección y configuración HTTP                |

## 🏗️ Arquitectura

```text
Solicitud HTTP
     │
     ▼
Router → authenticate / authorize → validateRequest
     │
     ▼
Controller
     │
     ▼
Service              ← reglas de negocio
     │
     ▼
Repository           ← consultas Knex
     │
     ▼
Microsoft SQL Server
```

### 📁 Estructura principal

```text
src/
├── configurations/
│   └── database.ts
├── features/
│   ├── auth/
│   ├── users/
│   ├── roles/
│   ├── permissions/
│   └── menu-items/
├── shared/
│   ├── constants/
│   ├── controllers/
│   ├── errors/
│   ├── http/
│   ├── middlewares/
│   ├── repositories/
│   ├── security/
│   └── services/
└── routes/
    └── index.ts
```

> El árbol muestra los directorios principales del core. Los archivos de configuración adicionales pueden variar según la versión del repositorio.

### ♻️ Componentes base

| Componente        | Responsabilidad                                                       |
| ----------------- | --------------------------------------------------------------------- |
| `BaseRepository`  | Consultas CRUD, búsqueda por ID, conteo y paginación                  |
| `BaseService`     | Operaciones de negocio comunes y tratamiento de recursos inexistentes |
| `BaseController`  | Respuestas HTTP consistentes para operaciones CRUD                    |
| `validateRequest` | Validación con Zod de `body`, `params` y `query`                      |
| `authenticate`    | Validación del token de acceso                                        |
| `authorize`       | Comprobación de permisos del usuario                                  |
| `ApiResponder`    | Formato unificado de respuestas                                       |

## 🗃️ Modelo de datos

El core utiliza **dos esquemas** en SQL Server:

- **`security`**: identidad y autorización.
- **`navigation`**: estructura y asignación de menús.

| Tabla                        | Finalidad                          |
| ---------------------------- | ---------------------------------- |
| `security.users`             | Usuarios y credenciales            |
| `security.roles`             | Roles del sistema                  |
| `security.permissions`       | Catálogo de permisos               |
| `security.user_roles`        | Relación entre usuarios y roles    |
| `security.role_permissions`  | Relación entre roles y permisos    |
| `navigation.menu_items`      | Opciones y jerarquía de navegación |
| `navigation.role_menu_items` | Relación entre roles y menús       |

Las tablas de relación utilizan claves primarias compuestas y claves foráneas. Los campos de auditoría registran fechas de creación y, cuando corresponde, actualización.

### 🧩 Preparación de la base de datos

1. Crea una base de datos en SQL Server.
2. Ejecuta el script SQL del esquema de seguridad y navegación.
3. Configura la conexión de Knex mediante las variables de entorno requeridas por `src/configurations/database.ts`.
4. Registra los permisos iniciales y asígnalos al rol administrador.
5. Crea el usuario administrador utilizando el flujo de creación que aplique hash Argon2id a la contraseña; **no insertes contraseñas en texto plano**.

> El script de tablas define la estructura, pero no reemplaza la carga inicial de roles, permisos, asignaciones y usuarios.

## 🚀 Instalación y ejecución

### Requisitos

- Node.js y npm compatibles con `package.json`.
- Una instancia accesible de Microsoft SQL Server.
- Una base de datos creada con el esquema anterior.

```bash
git clone <URL_DEL_REPOSITORIO>
cd <DIRECTORIO_DEL_REPOSITORIO>
npm ci
```

Si el repositorio incluye `.env.example`, cópialo y configura sus valores:

```bash
cp .env.example .env
```

La configuración debe incluir los parámetros del servidor, la conexión a SQL Server y el secreto o material criptográfico utilizado para firmar los JWT. **Consulta el esquema de variables de entorno del repositorio para conocer los nombres exactos y sus requisitos**; no uses secretos reales en archivos versionados.

Para iniciar en desarrollo:

```bash
npm run dev
```

Para verificar el tipado de TypeScript:

```bash
npx tsc --noEmit
```

> `npm ci` requiere un archivo `package-lock.json` válido. Los scripts adicionales (`build`, `start`, `check`, etc.) dependen de lo definido en `package.json`.

## 🐳 Dockerización

El backend puede ejecutarse en un contenedor Docker **sin Nginx**: Node.js y Express atienden las solicitudes HTTP directamente. SQL Server puede ejecutarse en una instancia externa o en un contenedor independiente; **no está incluido en la imagen del backend**.

### 📦 Dockerfile multi-stage

El `Dockerfile` propuesto separa la compilación TypeScript de la ejecución en producción. Requiere que `package.json` incluya un script `build` que genere `build/`, un archivo `package-lock.json` y que el punto de entrada compilado sea `build/server.js`. **Verifica estas rutas y scripts en tu repositorio antes de construir la imagen.**

```dockerfile
# Compilación
FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Ejecución
FROM node:22-bookworm-slim AS production
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder /app/build ./build
USER node
EXPOSE 3000
CMD ["node", "build/server.js"]
```

> Si la compilación necesita otros archivos de configuración o recursos de ejecución, agrégalos a las etapas correspondientes. El puerto `3000` es ilustrativo y debe coincidir con la configuración real de Express.

### 🚫 .dockerignore

Crea un archivo `.dockerignore` en la raíz para evitar copiar dependencias locales, artefactos y secretos al contexto de construcción:

```dockerignore
node_modules
build
coverage
.git
.env
.env.*
!.env.example
*.log
.vscode
.idea
```

### ▶️ Construir y ejecutar

Requiere Docker instalado y una instancia de SQL Server accesible desde el contenedor.

```bash
docker build -t backend-core:1.0.0 .
```

```bash
docker run -d \
    --name backend-core \
    --restart unless-stopped \
    -p 3000:3000 \
    --env-file .env \
    backend-core:1.0.0
```

Para consultar los registros o detener el servicio:

```bash
docker logs -f backend-core
docker stop backend-core
```

### 🔧 Consideraciones de despliegue

- **Conexión SQL Server:** `localhost` dentro del contenedor hace referencia al propio contenedor, no a la computadora anfitriona. Configura un nombre de host o dirección accesible desde Docker. `host.docker.internal` puede utilizarse en entornos compatibles; en Linux puede requerir configuración adicional.
- **Variables de entorno:** utiliza los nombres definidos por la configuración real del proyecto. El archivo `.env` se inyecta al ejecutar el contenedor y no debe incluirse en la imagen.
- **Red:** Express debe escuchar en una interfaz accesible desde el contenedor, por ejemplo `0.0.0.0`.
- **Swagger:** si la configuración busca archivos `src/**/*.swagger.ts`, adapta las rutas para localizar los archivos JavaScript compilados en `build`.
- **Dependencias nativas:** verifica la carga de Argon2id en la imagen final.
- **Producción:** Docker no proporciona HTTPS por sí solo. Nginx **no es obligatorio**; si se necesita TLS, proxy inverso o balanceo, se puede utilizar un proxy independiente o un servicio administrado.

## 🔌 Endpoints principales

Todas las rutas se montan bajo el prefijo `/api`.

### 🔑 Autenticación

| Método  | Endpoint                | Descripción                                |
| ------- | ----------------------- | ------------------------------------------ |
| `POST`  | `/api/auth/login`       | Iniciar sesión                             |
| `GET`   | `/api/auth/me`          | Consultar el perfil autenticado            |
| `GET`   | `/api/auth/menu`        | Consultar el menú jerárquico propio        |
| `PATCH` | `/api/auth/me/password` | Actualiza la contraseña del usuario activo |

### 👥 Usuarios

| Método   | Endpoint                    | Descripción                           |
| -------- | --------------------------- | ------------------------------------- |
| `GET`    | `/api/users`                | Listar usuarios con paginación        |
| `GET`    | `/api/users/count`          | Contar usuarios                       |
| `GET`    | `/api/users/:id`            | Consultar usuario                     |
| `POST`   | `/api/users`                | Crear usuario                         |
| `PATCH`  | `/api/users/:id`            | Actualizar usuario                    |
| `DELETE` | `/api/users/:id`            | Eliminar usuario                      |
| `GET`    | `/api/users/:id/roles`      | Consultar roles asignados             |
| `PUT`    | `/api/users/:id/roles`      | Sincronizar roles asignados           |
| `GET`    | `/api/users/:id/menu-items` | Consultar menú efectivo de un usuario |

### 🛡️ Roles

| Método   | Endpoint                     | Descripción                  |
| -------- | ---------------------------- | ---------------------------- |
| `GET`    | `/api/roles`                 | Listar roles                 |
| `GET`    | `/api/roles/count`           | Contar roles                 |
| `GET`    | `/api/roles/:id`             | Consultar rol                |
| `POST`   | `/api/roles`                 | Crear rol                    |
| `PATCH`  | `/api/roles/:id`             | Actualizar rol               |
| `DELETE` | `/api/roles/:id`             | Eliminar rol                 |
| `GET`    | `/api/roles/:id/permissions` | Consultar permisos del rol   |
| `PUT`    | `/api/roles/:id/permissions` | Sincronizar permisos del rol |
| `GET`    | `/api/roles/:id/menu-items`  | Consultar menús del rol      |
| `PUT`    | `/api/roles/:id/menu-items`  | Sincronizar menús del rol    |

### 🔐 Permisos y 🧭 menús

Las features `permissions` y `menu-items` exponen operaciones CRUD convencionales:

| Método   | Permisos                 | Menús                   |
| -------- | ------------------------ | ----------------------- |
| `GET`    | `/api/permissions`       | `/api/menu-items`       |
| `GET`    | `/api/permissions/count` | `/api/menu-items/count` |
| `GET`    | `/api/permissions/:id`   | `/api/menu-items/:id`   |
| `POST`   | `/api/permissions`       | `/api/menu-items`       |
| `PATCH`  | `/api/permissions/:id`   | `/api/menu-items/:id`   |
| `DELETE` | `/api/permissions/:id`   | `/api/menu-items/:id`   |

> Las operaciones administrativas requieren autenticación y los permisos correspondientes. La documentación OpenAPI detalla los contratos de cada endpoint.

## 🔒 Autenticación y autorización

El sistema utiliza **JWT** para identificar al usuario. Las contraseñas se almacenan mediante **Argon2id**; no se devuelven hashes en las respuestas públicas de usuarios.

El modelo de autorización sigue esta relación:

```text
Usuario ──► Roles ──► Permisos
                └──► Opciones de menú
```

Los permisos se expresan mediante códigos, por ejemplo:

```text
USER_READ
USER_CREATE
USER_UPDATE
USER_DELETE
USER_ROLE_READ
USER_ROLE_SYNC
USER_MENU_READ
ROLE_PERMISSION_READ
ROLE_PERMISSION_SYNC
ROLE_MENU_READ
ROLE_MENU_SYNC
```

Los permisos de lectura y sincronización de relaciones son independientes de los permisos CRUD generales. La autorización de los endpoints se comprueba en el backend; **ocultar una opción del menú no concede ni revoca acceso a una API**.

> ⚠️ La asignación de permisos a roles es una operación privilegiada. Debe concederse únicamente a administradores autorizados, ya que puede modificar los privilegios efectivos de otros usuarios.

## 🌳 Navegación jerárquica para Frontend

El endpoint `GET /api/auth/menu` devuelve las opciones activas asignadas a los roles activos del usuario autenticado. El resultado:

- Elimina opciones duplicadas cuando aparecen en varios roles.
- Organiza los nodos mediante `parent_id`.
- Respeta `sort_order`.
- Devuelve hijos dentro de `items`.
- Utiliza propiedades compatibles con algunos Frameworks frontend: `label`, `icon` y `routerLink`.

**Ejemplo ilustrativo del arreglo `data`:**

```json
[
    {
        "id": 1,
        "label": "Administración",
        "icon": "pi pi-cog",
        "items": [
            {
                "id": 2,
                "label": "Usuarios",
                "icon": "pi pi-users",
                "routerLink": "/users"
            },
            {
                "id": 3,
                "label": "Roles",
                "icon": "pi pi-shield",
                "routerLink": "/roles"
            }
        ]
    }
]
```

El arreglo se entrega dentro del formato de respuesta definido por `ApiResponder.ok()`.

**Integración ilustrativa en Angular:**

```typescript
import type { MenuItem } from "primeng/api";

interface ApiResponse<T> {
    data: T;
}

// En un servicio o componente con HttpClient inyectado:
this.http.get<ApiResponse<MenuItem[]>>("/api/auth/menu").subscribe(({ data }) => {
    this.items = data;
});
```

```html
<p-panelMenu [model]="items"></p-panelMenu>
```

> Los valores de `icon` deben corresponder a clases disponibles en el frontend, por ejemplo `pi pi-users`.

## 📄 Documentación y respuestas

La API utiliza **Swagger/OpenAPI** para documentar las operaciones. En la configuración original del template, Swagger UI se expone en desarrollo en:

```text
http://localhost:3000/api/docs
```

La URL final depende del puerto y de la configuración del servidor.

Las respuestas exitosas se construyen con `ApiResponder`. Los errores se centralizan mediante `AppError` y el manejador global, con formato **Problem Details (RFC 9457)**.

## 🧪 Verificaciones recomendadas

Antes de reutilizar o desplegar el template, verifica:

- [ ] Inicio de sesión válido, inválido y token expirado.
- [ ] Rechazo de usuarios y roles inactivos.
- [ ] Respuestas `401` y `403` en rutas protegidas.
- [ ] Operaciones CRUD y validaciones Zod.
- [ ] Sincronización de roles, permisos y menús.
- [ ] Menús con varios niveles, duplicados y usuarios sin opciones asignadas.
- [ ] Integridad referencial, restricciones únicas y errores SQL Server.
- [ ] Compilación TypeScript y documentación Swagger.
- [ ] Protección de secretos, encabezados HTTP y configuración de producción.

> El alcance funcional del core está implementado según el desarrollo del proyecto; la preparación para producción requiere completar y documentar las verificaciones de integración, seguridad y despliegue.

## 🧩 Extender el template

Para incorporar un módulo nuevo:

1. Define sus tipos y esquemas Zod.
2. Crea el repositorio utilizando `BaseRepository` cuando aplique.
3. Implementa las reglas de negocio en el servicio.
4. Expón las operaciones desde el controlador.
5. Declara rutas con validación, autenticación y permisos.
6. Documenta los endpoints en OpenAPI.
7. Registra los permisos y asígnalos a los roles apropiados.
8. Agrega opciones de menú solo si el módulo necesita navegación.

La intención es **reutilizar el core sin acoplarlo a la lógica de negocio** de un sistema concreto.

## 📄 Licencia

Este proyecto se distribuye bajo los términos del archivo [LICENSE](LICENSE), si está incluido en el repositorio.
