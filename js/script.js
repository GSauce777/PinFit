// Get html elements
const searchInput = document.querySelector(".search-input");
const searchResults = document.querySelector(".search-results");
const findFitBtn = document.querySelector(".find-fit-btn");

// Fetch imgs from SerpAPI
async function searchClothing(query) {

    searchResults.innerHTML = "<p class='loading-text'>Searching...</p>";

    // Calling server
    const url=`/search?q=${encodeURIComponent(query)}`;

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

            let clearBtn = slot.querySelector('.clear-btn');

            if (!clearBtn) {
                clearBtn = document.createElement('button');
                clearBtn.classList.add('clear-btn');
                clearBtn.textContent = '✕';
                clearBtn.title = "Clear slot";

                clearBtn.addEventListener('click', () => {
                    existingImg.remove();
                    clearBtn.remove();
                    if (label) label.style.display = 'block';
                });

                slot.appendChild(clearBtn);
            }
        }
    });
});

// Get the title and icon elements
const outfitTitle = document.querySelector('.outfit-title');
const editIcon = document.querySelector('.edit-icon');

// Listener for clicks on the edit icon
editIcon.addEventListener('click', () => {
    // Focus on the title to allow typing
    outfitTitle.focus();
    
    // Selects all the text inside so the user can just start typing to replace it
    const range = document.createRange();
    range.selectNodeContents(outfitTitle);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
});

// Max title length to prevent overflow
const MAX_TITLE_LENGTH = 50;

// Listener for keydown events on the title
outfitTitle.addEventListener('keydown', (event) => {
    // If the user presses Enter, remove focus from the title to save it
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default action of creating a line break inside the title
        outfitTitle.blur();
        return;
    }

    // Allow Ctrl/Cmd + key combinations for shortcuts
    if (event.ctrlKey || event.metaKey) {
        return;
    }

    // Allow these keys even if max length is reached
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];

    // Check if user has highlighted text
    const selection = window.getSelection();
    const hasSelection = selection.toString().length > 0;

    // Blocks typing if
    // 1. Title is at or over max length
    // 2. Key press is not an allowed key (like backspace or arrow keys)
    // 3. User does not have any text highlighted
    if (outfitTitle.innerText.length >= MAX_TITLE_LENGTH && !allowedKeys.includes(event.key) && !hasSelection) {
        event.preventDefault();
    }
});

outfitTitle.addEventListener('paste', (event) => {
    // Stop the browser from pasting the text normally
    event.preventDefault();

    // Get the text the user is trying to paste
    let pastedText = (event.clipboardData || window.clipboardData).getData('text');

    // Calculate how much room is left in the title
    const currentLength = outfitTitle.innerText.length;
    const spaceLeft = MAX_TITLE_LENGTH - currentLength;

    // If there is space left, only paste the amount of characters that will fit
    if (spaceLeft > 0) {
        const textToInsert = pastedText.substring(0, spaceLeft);
        
        // Safely inserts the text where the user's cursor currently is
        document.execCommand('insertText', false, textToInsert);
    }
})