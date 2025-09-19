use tauri::{App, Manager};


pub fn setup_app(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    setup_tray(app)?;
    setup_splashscreen(app)?;
    Ok(())
}

fn setup_splashscreen(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    if let Some(splashscreen) = app.get_webview_window("splashscreen") {
        let app_handle = app.handle().clone();
        std::thread::spawn(move || {
            std::thread::sleep(std::time::Duration::from_secs(2));

            if let Some(splashscreen) = app_handle.get_webview_window("splashscreen") {
                let _ = splashscreen.close();
            }

            if let Some(main_window) = app_handle.get_webview_window("main") {
                let _ = main_window.show();
                let _ = main_window.set_focus();
            }
        });
    }

    Ok(())
}

fn setup_tray(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    use tauri::{
        menu::{Menu, MenuItem},
        tray::TrayIconBuilder,
    };

    let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&quit_i])?;

    let _tray = TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .show_menu_on_left_click(true)
        .build(app)?;

    Ok(())
}
