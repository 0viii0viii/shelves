mod database;
mod plugins;
mod setup;

use tauri_plugin_deep_link::DeepLinkExt;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_deep_link::init())
        .setup(|app| {
            // Note that get_current's return value will also get updated every time on_open_url gets triggered.
            let start_urls = app.deep_link().get_current()?;
            if let Some(urls) = start_urls {
                // app was likely started by a deep link
                println!("deep link URLs: {:?}", urls);
            }

            app.deep_link().on_open_url(|event| {
                println!("deep link URLs: {:?}", event.urls());
            });
            Ok(())
        })
        .setup(setup::setup_app)
        .plugin(plugins::configure_sql())
        .plugin(plugins::configure_opener())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
