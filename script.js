// Get html elements
const searchInput = document.querySelector(".search-input");
const searchResults = document.querySelector(".search-results");
const findFitBtn = document.querySelector(".find-fit-btn");

// Fetch imgs from SerpAPI
async function searchClothing(query) {

    searchResults.innerHTML = "<p class='loading-text'>Searching...</p>";

    // Calling server
    const url = `/search?q=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        const images = await response.json();
        displayResults(images);
    } catch (error) {
        searchResults.innerHTML = "<p class='loading-text'>Something went horribly wrong. Try again.</p>";
        console.error("Server error:", error);
    }
}

// Display results
function displayResults(images) {

    // Clear loading text
    searchResults.innerHTML = "";

    // If no results, tell user
    if (!images || images.length === 0) {
        searchResults.innerHTML = "<p class='loading-text'>No images found.</p>";
        return;
    }

    // Loop through first 10 images and create <img> for each
    images.slice(0, 10).forEach((image) => {
        const img = document.createElement("img");
        img.src = image.thumbnail;
        img.alt = image.title;
        img.classList.add("result-img");

        img.draggable = true;

        img.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', image.thumbnail);
            e.dataTransfer.effectAllowed = 'copy';
        });

        img.addEventListener("click", () => {
            console.log("Image clicked:", image.thumbnail);
        });
       searchResults.appendChild(img);
    });
}

// Event listener stuff
searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const query = searchInput.value.trim();
        if (query !== "") {
            searchClothing(query);
        }
    }
});

// Add drag-and-drop functionality to clothing slots
const clothingSlots = document.querySelectorAll('.clothing-slot');
clothingSlots.forEach(slot => {
    // Allow dropping, preventing default browser behavior
    slot.addEventListener('dragover', (e) => {
        e.preventDefault(); 
        e.dataTransfer.dropEffect = 'copy';
        slot.classList.add('drag-over'); // Add visual feedback when dragging over clothing slot
    });

    // Remove visual feedback if the dragged item leaves the slot
    slot.addEventListener('dragleave', () => {
        slot.classList.remove('drag-over');
    });

    // Handle the image drop event
    slot.addEventListener('drop', (e) => {
        e.preventDefault();
        slot.classList.remove('drag-over');

        // Get the image URL from the dragged data
        const imgSrc = e.dataTransfer.getData('text/plain');
        
        if (imgSrc) {
            // Hide the clothing slot label
            const label = slot.querySelector('.slot-label');
            if(label) label.style.display = 'none';

            // Check if an image already exists in this slot
            let existingImg = slot.querySelector('.slotted-img');
            
            // If it doesn't exist, create slotted image
            // If it does, just update the src of the img within the clothing slot
            if (!existingImg) {
                existingImg = document.createElement('img');
                existingImg.classList.add('slotted-img');
                slot.appendChild(existingImg);
            }
            existingImg.src = imgSrc;
        }
    });
});