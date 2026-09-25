import "./styles.css"; // loades the styles lmao why tf am i even commenting this...

// 1. Import the bridge command from Tauri
import { invoke } from "@tauri-apps/api/core";

// 2. Define the shape of our data (just like the struct in Rust!)
interface MinecraftVersion {
  id: string;
  type: string;
  url: string;
}

async function loadVersions() {
  try {
    // 3. Ask Rust to fetch the data
    const versions = await invoke<MinecraftVersion[]>("fetch_versions");
    
    // 4. For now, let's just print it to the developer console to verify it works
    console.log("Loaded versions from Rust:", versions);
    
  } catch (error) {
    console.error("Failed to fetch versions:", error);
  }
}

// Run the function when the app starts
loadVersions();

const customSelect = document.querySelector(".custom-select");
const selectTrigger = document.querySelector(".select-trigger-btn"); 

selectTrigger?.addEventListener("click", () => {
  customSelect?.classList.toggle("open");
});