const PORT = 8000;

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI("AIzaSyAgOaIfjbaVgYNsRKcIAtP1rSu7YltsE_E"); // Use environment variable for API key

app.post('/gemini', async (req, res) => {
    try {
        const { history, message } = req.body;

        // Initialize the model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Start a chat with the history
        const chat = model.startChat({
            history: history.map(msg => ({
                role: msg.role === "user" ? "user" : "model",
                parts: [{ text: msg.parts }]
            }))
        });

        // Send the message and get the response
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        // Send the response back to the client
        res.send(text);
    } catch (error) {
        console.error('Error in /gemini endpoint:', error);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});