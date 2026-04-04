// Imports
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const {pool, testConnection} = require('./database/pinfitDatabase')

// App setup
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

//tests database connection on startup
testConnection();

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

//save outfit to the database
app.post("/api/save-outfit", async(req, res)=> {
    const {user_id, outfit_name, top_image, bottom_image, shoes_image} = req.body;
    
    console.log('Received save request:', {user_id, outfit_name, top_image, bottom_image, shoes_image});
    
    if (!user_id ||!outfit_name){
        return res.status(400).json({ error:"User ID and outfit name are required"});
    }
    
    try {
        const [result]=await pool.execute(
            'INSERT INTO saved_outfits (user_id, outfit_name, top_image_url, bottom_image_url, shoes_image_url) VALUES (?, ?, ?, ?, ?)',
            [user_id, outfit_name, top_image || null, bottom_image || null, shoes_image || null]
        );
        
        res.json({ 
            success: true, 
            message:"Outfit saved successfully!",
            outfit_id: result.insertId 
        });
    } catch (error) {
        console.error("Error saving outfit:", error);
        res.status(500).json({error:"Failed to save outfit", details: error.message});
    }
});

//get saved outfits
app.get("/api/get-outfits/:userId", async(req, res)=>{
    const userId = req.params.userId;
    
    try {
        const [outfits] =await pool.execute(
            'SELECT * FROM saved_outfits WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        
        res.json({ success: true, outfits });
    } catch (error) {
        console.error("Error fetching outfits:", error);
        res.status(500).json({error: "Failed to fetch outfits"});
    }
});

// Delete saved outfit
app.delete("/api/delete-outfit/:outfitId", async(req, res)=>{
    const outfitId = req.params.outfitId;
    
    try {
        await pool.execute('DELETE FROM saved_outfits WHERE id = ?', [outfitId]);
        res.json({ success: true, message: "Outfit deleted successfully"});
    } catch (error) {
        console.error("Error deleting outfit:", error);
        res.status(500).json({error:"Failed to delete outfit"});
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`PinFit server running at http://localhost:${PORT}`);
});