use tauri_plugin_sql::{Migration, MigrationKind};  

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
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
    
    ];

    tauri::Builder::default()
    .plugin(
        tauri_plugin_sql::Builder::default()
            .add_migrations("sqlite:shelves.db", migrations)
            .build()
    )
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
