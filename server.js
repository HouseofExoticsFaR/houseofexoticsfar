const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Care guide endpoint
app.post('/api/care-guide', async (req, res) => {
    try {
        const { animalName } = req.body;
        
        if (!animalName) {
            return res.status(400).json({ error: 'Animal name is required' });
        }

        const response = await fetch('https://api.own-ai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OWNAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "own-ai-model", // Replace with actual OwnAI model name
                messages: [{
                    role: "user",
                    content: `You are an aquatic pet care specialist. Provide concise, accurate care information for: ${animalName}. Include: tank size, water parameters, diet, and special care requirements. Keep it brief and bullet-pointed.`
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('OwnAI API Error:', errorData);
            throw new Error(errorData.error?.message || 'Failed to fetch care information');
        }

        const data = await response.json();
        res.json({ careInfo: data.choices[0].message.content });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: 'Failed to fetch care information', details: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});




