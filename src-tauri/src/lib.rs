use serde::{Deserialize, Serialize};

// 1. Structs
#[derive(Serialize, Deserialize)]
struct MinecraftVersion {
    id: String,
    #[serde(rename = "type")]
    version_type: String,
    url: String,
}

#[derive(Serialize, Deserialize)]
struct VersionManifest {
    versions: Vec<MinecraftVersion>,
}

// 2. The Command (Make sure #[tauri::command] is right above it!)
#[tauri::command]
async fn fetch_versions() -> Result<Vec<MinecraftVersion>, String> {
    let url = "https://piston-meta.mojang.com/mc/game/version_manifest_v2.json";

    let response = reqwest::get(url).await.map_err(|e| e.to_string())?;
    let manifest: VersionManifest = response.json().await.map_err(|e| e.to_string())?;

    Ok(manifest.versions)
}

// 3. The Run Function
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![fetch_versions])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
