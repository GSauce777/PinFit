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