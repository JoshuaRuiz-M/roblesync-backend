    /* ============================================================
    DATABASE CORE - SECURITY & NAVIGATION
    DATABASE ENGINE: SQL SERVER
    ============================================================ */
    IF NOT EXISTS (
        SELECT 1
        FROM sys.schemas
        WHERE name = 'security'
    )
    BEGIN
        EXEC('CREATE SCHEMA security');
    END;
    GO

    IF NOT EXISTS (
        SELECT 1
        FROM sys.schemas
        WHERE name = 'navigation'
    )
    BEGIN
        EXEC('CREATE SCHEMA navigation');
    END;
    GO


    CREATE TABLE security.users (
        user_id INT IDENTITY(1,1) NOT NULL,
        username NVARCHAR(50) NOT NULL,
        email NVARCHAR(255) NOT NULL,
        password_hash NVARCHAR(255) NOT NULL,
        first_name NVARCHAR(100) NOT NULL,
        last_name NVARCHAR(100) NOT NULL,
        is_active BIT NOT NULL,
        created_at DATETIME2(3) NOT NULL,
        updated_at DATETIME2(3) NULL
    );
    GO

    ALTER TABLE security.users ADD CONSTRAINT PK_users PRIMARY KEY (user_id);
    GO

    ALTER TABLE security.users ADD CONSTRAINT UQ_users_username UNIQUE (username);
    GO

    ALTER TABLE security.users ADD CONSTRAINT UQ_users_email UNIQUE (email);
    GO

    ALTER TABLE security.users ADD CONSTRAINT DF_users_is_active DEFAULT (1) FOR is_active;
    GO

    ALTER TABLE security.users ADD CONSTRAINT DF_users_created_at DEFAULT (SYSUTCDATETIME()) FOR created_at;
    GO


    CREATE TABLE security.roles (
        role_id INT IDENTITY(1,1) NOT NULL,
        code NVARCHAR(100) NOT NULL,
        name NVARCHAR(150) NOT NULL,
        description NVARCHAR(500) NULL,
        is_active BIT NOT NULL,
        created_at DATETIME2(3) NOT NULL,
        updated_at DATETIME2(3) NULL
    );
    GO

    ALTER TABLE security.roles ADD CONSTRAINT PK_roles PRIMARY KEY (role_id);
    GO

    ALTER TABLE security.roles ADD CONSTRAINT UQ_roles_code UNIQUE (code);
    GO

    ALTER TABLE security.roles ADD CONSTRAINT DF_roles_is_active DEFAULT (1) FOR is_active;
    GO

    ALTER TABLE security.roles ADD CONSTRAINT DF_roles_created_at DEFAULT (SYSUTCDATETIME()) FOR created_at;
    GO


    CREATE TABLE security.permissions (
        permission_id INT IDENTITY(1,1) NOT NULL,
        code NVARCHAR(150) NOT NULL,
        name NVARCHAR(150) NOT NULL,
        description NVARCHAR(500) NULL,
        is_active BIT NOT NULL,
        created_at DATETIME2(3) NOT NULL,
        updated_at DATETIME2(3) NULL
    );
    GO

    ALTER TABLE security.permissions ADD CONSTRAINT PK_permissions PRIMARY KEY (permission_id);
    GO

    ALTER TABLE security.permissions ADD CONSTRAINT UQ_permissions_code UNIQUE (code);
    GO

    ALTER TABLE security.permissions ADD CONSTRAINT DF_permissions_is_active DEFAULT (1) FOR is_active;
    GO

    ALTER TABLE security.permissions ADD CONSTRAINT DF_permissions_created_at DEFAULT (SYSUTCDATETIME()) FOR created_at;
    GO

    CREATE TABLE security.user_roles (
        user_id INT NOT NULL,
        role_id INT NOT NULL,
        created_at DATETIME2(3) NOT NULL
    );
    GO

    ALTER TABLE security.user_roles ADD CONSTRAINT PK_user_roles PRIMARY KEY (user_id, role_id);
    GO

    ALTER TABLE security.user_roles ADD CONSTRAINT FK_user_roles_users FOREIGN KEY (user_id) REFERENCES security.users(user_id);
    GO

    ALTER TABLE security.user_roles ADD CONSTRAINT FK_user_roles_roles FOREIGN KEY (role_id) REFERENCES security.roles(role_id);
    GO

    ALTER TABLE security.user_roles ADD CONSTRAINT DF_user_roles_created_at DEFAULT (SYSUTCDATETIME()) FOR created_at;
    GO

    CREATE TABLE security.role_permissions (
        role_id INT NOT NULL,
        permission_id INT NOT NULL,
        created_at DATETIME2(3) NOT NULL
    );
    GO

    ALTER TABLE security.role_permissions ADD CONSTRAINT PK_role_permissions PRIMARY KEY (role_id, permission_id);
    GO

    ALTER TABLE security.role_permissions ADD CONSTRAINT FK_role_permissions_roles FOREIGN KEY (role_id) REFERENCES security.roles(role_id);
    GO

    ALTER TABLE security.role_permissions ADD CONSTRAINT FK_role_permissions_permissions FOREIGN KEY (permission_id) REFERENCES security.permissions(permission_id);
    GO

    ALTER TABLE security.role_permissions ADD CONSTRAINT DF_role_permissions_created_at DEFAULT (SYSUTCDATETIME()) FOR created_at;
    GO

    CREATE TABLE navigation.menu_items (
        menu_item_id INT IDENTITY(1,1) NOT NULL,
        parent_id INT NULL,
        code NVARCHAR(100) NOT NULL,
        label NVARCHAR(150) NOT NULL,
        path NVARCHAR(255) NULL,
        icon NVARCHAR(100) NULL,
        sort_order INT NOT NULL,
        is_active BIT NOT NULL,
        created_at DATETIME2(3) NOT NULL,
        updated_at DATETIME2(3) NULL
    );
    GO

    ALTER TABLE navigation.menu_items ADD CONSTRAINT PK_menu_items PRIMARY KEY (menu_item_id);
    GO

    ALTER TABLE navigation.menu_items ADD CONSTRAINT FK_menu_items_parent FOREIGN KEY (parent_id) REFERENCES navigation.menu_items(menu_item_id);
    GO

    ALTER TABLE navigation.menu_items ADD CONSTRAINT UQ_menu_items_code UNIQUE (code);
    GO

    ALTER TABLE navigation.menu_items ADD CONSTRAINT CK_menu_items_sort_order CHECK (sort_order >= 0);
    GO

    ALTER TABLE navigation.menu_items ADD CONSTRAINT CK_menu_items_parent CHECK (parent_id IS NULL OR parent_id <> menu_item_id);
    GO

    ALTER TABLE navigation.menu_items ADD CONSTRAINT DF_menu_items_sort_order DEFAULT (0) FOR sort_order;
    GO

    ALTER TABLE navigation.menu_items ADD CONSTRAINT DF_menu_items_is_active DEFAULT (1) FOR is_active;
    GO

    ALTER TABLE navigation.menu_items ADD CONSTRAINT DF_menu_items_created_at DEFAULT (SYSUTCDATETIME()) FOR created_at;
    GO

    CREATE TABLE navigation.role_menu_items (
        role_id INT NOT NULL,
        menu_item_id INT NOT NULL,
        created_at DATETIME2(3) NOT NULL
    );
    GO

    ALTER TABLE navigation.role_menu_items ADD CONSTRAINT PK_role_menu_items PRIMARY KEY (role_id, menu_item_id);
    GO

    ALTER TABLE navigation.role_menu_items ADD CONSTRAINT FK_role_menu_items_roles FOREIGN KEY (role_id) REFERENCES security.roles(role_id);
    GO

    ALTER TABLE navigation.role_menu_items ADD CONSTRAINT FK_role_menu_items_menu_items FOREIGN KEY (menu_item_id) REFERENCES navigation.menu_items(menu_item_id);
    GO

    ALTER TABLE navigation.role_menu_items ADD CONSTRAINT DF_role_menu_items_created_at DEFAULT (SYSUTCDATETIME()) FOR created_at;
    GO


    CREATE NONCLUSTERED INDEX IX_user_roles_role_id ON security.user_roles(role_id);
    GO
    CREATE NONCLUSTERED INDEX IX_role_permissions_permission_id ON security.role_permissions(permission_id);
    GO
    CREATE NONCLUSTERED INDEX IX_menu_items_parent_id_sort_order ON navigation.menu_items(parent_id, sort_order);
    GO
    CREATE NONCLUSTERED INDEX IX_role_menu_items_menu_item_id ON navigation.role_menu_items(menu_item_id);
    GO
