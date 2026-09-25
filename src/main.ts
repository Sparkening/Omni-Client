import "./styles.css"; // loades the styles lmao why tf am i even commenting this...

// 1. Import the bridge command from Tauri
import { invoke } from "@tauri-apps/api/core";

// Must match the Rust struct exactly
interface MinecraftInstance {
  id: string;
  name: string;
  version: string;
  status: string;
  is_online: boolean;
}

async function loadInstances() {
  try {
    // 1. Fetch data from Rust
    const instances = await invoke<MinecraftInstance[]>("fetch_instances");
    
    // 2. Find the container in our HTML
    const listContainer = document.querySelector(".jump-in-list");
    if (!listContainer) return;

    // 3. Clear out the hardcoded mock data
    listContainer.innerHTML = "";

    // 4. Generate a new card for each instance
    instances.forEach((instance) => {
      // Dynamically assign classes based on online status
      const pillClass = instance.is_online ? "status-pill online" : "status-pill";
      const iconClass = instance.is_online ? "fi-br-box" : "fi-br-cube";

      const cardHTML = `
        <div class="instance-row-card">
          <div class="instance-icon-box">
            <i class="fi ${iconClass}"></i>
          </div>
          <div class="instance-info">
            <h3>${instance.name}</h3>
            <p><span>${instance.version}</span></p>
          </div>
          <span class="${pillClass}">${instance.status}</span>
          <button class="row-play-btn" data-id="${instance.id}">
            <i class="fi fi-br-play"></i>
          </button>
        </div>
      `;
      
      // Inject the newly built card into the DOM
      listContainer.insertAdjacentHTML("beforeend", cardHTML);
    });

    // 5. Attach click listeners to the dynamically generated Play buttons
    attachPlayButtonListeners();

  } catch (error) {
    console.error("Failed to fetch instances:", error);
  }
}

function attachPlayButtonListeners() {
  const playButtons = document.querySelectorAll(".row-play-btn");
  
  playButtons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const button = e.currentTarget as HTMLButtonElement;
      const instanceId = button.getAttribute("data-id");
      
      if (!instanceId) return;

      // Visually disable the button so the user doesn't spam click it
      button.style.opacity = "0.5";
      button.style.pointerEvents = "none";
      
      try {
        // Send the ID to Rust and wait for the response
        const response = await invoke<string>("launch_instance", { id: instanceId });
        console.log("Response from Rust:", response);
      } catch (error) {
        console.error("Failed to launch:", error);
      } finally {
        // Re-enable the button after the launch process finishes
        button.style.opacity = "1";
        button.style.pointerEvents = "auto";
      }
    });
  });
}

// Run the function when the app starts
loadInstances();

const customSelect = document.querySelector(".custom-select");
const selectTrigger = document.querySelector(".select-trigger-btn"); 

selectTrigger?.addEventListener("click", () => {
  customSelect?.classList.toggle("open");
});

// Define the shape for our library cards
interface LibraryPack {
  id: string;
  name: string;
  version: string;
  theme: string;
}

async function loadLibrary() {
  try {
    // 1. Fetch library data from Rust
    const packs = await invoke<LibraryPack[]>("fetch_library");
    
    // 2. Find the grid container in HTML
    const gridContainer = document.querySelector(".library-grid");
    if (!gridContainer) return;

    // 3. Clear out the hardcoded mock data
    gridContainer.innerHTML = "";

    // 4. Generate a new grid card for each pack
    packs.forEach((pack) => {
      const cardHTML = `
        <div class="grid-card squircle-card" data-id="${pack.id}">
          <div class="grid-card-banner ${pack.theme}"></div>
          <div class="grid-card-content">
            <h4>${pack.name}</h4>
            <p>${pack.version}</p>
          </div>
        </div>
      `;
      gridContainer.insertAdjacentHTML("beforeend", cardHTML);
    });

  } catch (error) {
    console.error("Failed to fetch library packs:", error);
  }
}

// Make sure to actually call the new function at the bottom of your file!
loadLibrary();