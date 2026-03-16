// Imports
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// App setup
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('.'));

// Search route
app.get("/search", async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ error: "No search query provided"});
    }

    const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&engine=google_images&ijn=0&api_key=${process.env.API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data.images_results);
    } catch (error) {
        console.log("SerpAPI error:", error);
        res.status(500).json({ error: "Failed to fetch images" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`PinFit server running at http://localhost:${PORT}`);
});