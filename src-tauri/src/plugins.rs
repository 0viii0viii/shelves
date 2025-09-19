use crate::database::get_migrations;

pub fn configure_sql() -> impl tauri::plugin::Plugin<tauri::Wry> {
    let migrations = get_migrations();

    tauri_plugin_sql::Builder::default()
        .add_migrations("sqlite:shelves.db", migrations)
        .build()
}

pub fn configure_opener() -> impl tauri::plugin::Plugin<tauri::Wry> {
    tauri_plugin_opener::init()
}
