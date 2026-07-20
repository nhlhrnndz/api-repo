// server.js
const express = require('express');
const cors = require('cors');

// Check if Node.js version supports native fetch
// If Node v18+, use global fetch, otherwise use node-fetch
let fetch;
try {
    // Try native fetch (Node.js v18+)
    fetch = global.fetch;
    if (!fetch) throw new Error('No native fetch');
    console.log('Using native fetch (Node.js v18+)');
} catch (e) {
    // Fallback to node-fetch
    fetch = require('node-fetch');
    console.log('Using node-fetch package');
}

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

console.log('Server starting...');

// GET endpoint - Fetch jokes
app.get('/api/jokes', async (req, res) => {
    try {
        console.log('Fetching joke...');
        const response = await fetch('https://v2.jokeapi.dev/joke/Any?safe-mode');
        const data = await response.json();
        console.log('Joke fetched successfully');
        res.json(data);
    } catch (error) {
        console.error('Error fetching jokes:', error);
        res.status(500).json({ error: 'Failed to fetch jokes' });
    }
});

// GET endpoint - Fetch cat facts
app.get('/api/cat-facts', async (req, res) => {
    try {
        console.log('Fetching cat fact...');
        const response = await fetch('https://catfact.ninja/fact');
        const data = await response.json();
        console.log('Cat fact fetched successfully');
        res.json(data);
    } catch (error) {
        console.error('Error fetching cat facts:', error);
        res.status(500).json({ error: 'Failed to fetch cat facts' });
    }
});

// POST endpoint - Add custom joke
app.post('/api/jokes', (req, res) => {
    const { joke } = req.body;
    
    if (!joke) {
        return res.status(400).json({ error: 'Joke is required' });
    }
    
    console.log('New joke submitted:', joke);
    
    res.json({ 
        message: 'Joke added successfully!', 
        joke: joke,
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoints:`);
    console.log(`   GET  http://localhost:${PORT}/api/jokes`);
    console.log(`   GET  http://localhost:${PORT}/api/cat-facts`);
    console.log(`   POST http://localhost:${PORT}/api/jokes`);
});