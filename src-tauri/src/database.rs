use tauri_plugin_sql::{Migration, MigrationKind};

pub fn get_migrations() -> Vec<Migration> {
    vec![
        Migration {
            version: 1,
            description: "create todos table",
            sql: "CREATE TABLE IF NOT EXISTS todos (  
                    id INTEGER PRIMARY KEY AUTOINCREMENT,  
                    content TEXT NOT NULL,  
                    completed INTEGER NOT NULL DEFAULT 0,
                    sortOrder INTEGER NOT NULL DEFAULT 0,
                    createdAt TEXT NOT NULL,  
                    updatedAt TEXT 
                )",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create notes table",
            sql: "CREATE TABLE IF NOT EXISTS notes (  
                    id INTEGER PRIMARY KEY AUTOINCREMENT,  
                    title TEXT NOT NULL,  
                    isLocked INTEGER NOT NULL DEFAULT 0,
                    password TEXT,
                    sortOrder INTEGER NOT NULL DEFAULT 0,
                    createdAt TEXT NOT NULL,  
                    updatedAt TEXT 
                )",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "create memos table",
            sql: "CREATE TABLE IF NOT EXISTS memos (  
                    id INTEGER PRIMARY KEY AUTOINCREMENT,  
                    noteId INTEGER NOT NULL,  
                    content TEXT NOT NULL,
                    sortOrder INTEGER NOT NULL DEFAULT 0,
                    createdAt TEXT NOT NULL,  
                    updatedAt TEXT,
                    FOREIGN KEY (noteId) REFERENCES notes (id) ON DELETE CASCADE
                )",
            kind: MigrationKind::Up,
        },
    ]
}
