use tauri_plugin_sql::{Migration, MigrationKind};

pub fn get_migrations() -> Vec<Migration> {
    vec![Migration {
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
    }]
}
