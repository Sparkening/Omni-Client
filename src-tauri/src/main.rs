#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::Serialize;

#[derive(Serialize)]
struct MinecraftInstance {
    id: String,
    name: String,
    version: String,
    status: String,
    is_online: bool,
}

// NEW: Define the shape of our visual library cards
#[derive(Serialize)]
struct LibraryPack {
    id: String,
    name: String,
    version: String,
    theme: String, // We'll use this to pass "banner-purple", "banner-green", etc.
}

#[tauri::command]
fn fetch_instances() -> Vec<MinecraftInstance> {
    vec![
        MinecraftInstance {
            id: "hypixel-skyblock".into(),
            name: "Hypixel Skyblock".into(),
            version: "Fabric 1.20.4".into(),
            status: "20,132 Online".into(),
            is_online: true,
        },
        MinecraftInstance {
            id: "forever-world".into(),
            name: "Forever World".into(),
            version: "Fabric 1.20.4 • Singleplayer".into(),
            status: "Offline".into(),
            is_online: false,
        },
    ]
}

// NEW: Command to fetch the library grid data
#[tauri::command]
fn fetch_library() -> Vec<LibraryPack> {
    vec![
        LibraryPack {
            id: "prominence".into(),
            name: "Prominence II".into(),
            version: "Fabric 1.20.1".into(),
            theme: "banner-purple".into(),
        },
        LibraryPack {
            id: "vanilla-speedrun".into(),
            name: "Vanilla Speedrun".into(),
            version: "Release 1.16.1".into(),
            theme: "banner-green".into(),
        },
        LibraryPack {
            id: "dev-challenge".into(),
            name: "Dev Challenge Pack".into(),
            version: "Fabric 1.20.4".into(),
            theme: "banner-amber".into(),
        },
    ]
}

// NEW: Command to simulate launching the game
#[tauri::command]
fn launch_instance(id: String) -> String {
    // In the future, this is where you will use std::process::Command
    // to actually execute the Java runtime and Minecraft arguments.

    println!("🚀 RUST BACKEND: Preparing to launch instance '{}'...", id);
    println!("✅ RUST BACKEND: Launch successful!");

    // Return a success string back to TypeScript
    format!("Successfully launched {}", id)
}

fn main() {
    tauri::Builder::default()
        // Register all THREE commands here!
        .invoke_handler(tauri::generate_handler![
            fetch_instances,
            fetch_library,
            launch_instance
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
