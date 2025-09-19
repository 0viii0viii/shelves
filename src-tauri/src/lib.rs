mod database;
mod setup;
mod plugins;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .setup(setup::setup_app)
        .plugin(plugins::configure_sql())
        .plugin(plugins::configure_opener())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
