const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// GET endpoint - Fetch jokes
app.get('/api/jokes', async (req, res) => {
    try {
        const response = await fetch('https://v2.jokeapi.dev/joke/Any?safe-mode');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching jokes:', error);
        res.status(500).json({ error: 'Failed to fetch jokes' });
    }
});

// GET endpoint - Fetch cat facts
app.get('/api/cat-facts', async (req, res) => {
    try {
        const response = await fetch('https://catfact.ninja/fact');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching cat facts:', error);
        res.status(500).json({ error: 'Failed to fetch cat facts' });
    }
});

// POST endpoint - Add custom joke (simulated)
app.post('/api/jokes', (req, res) => {
    const { joke } = req.body;
    
    if (!joke) {
        return res.status(400).json({ error: 'Joke is required' });
    }
    
    // In a real app, you'd save this to a database
    res.json({ 
        message: 'Joke added successfully!', 
        joke: joke,
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
