import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (commented out until you have your MongoDB URI)
/*
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Conversation Schema
const conversationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  messages: [{
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const Conversation = mongoose.model('Conversation', conversationSchema);
*/

// Initialize OpenAI (commented out until you have your OpenAI API key)
/*
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
*/

// Routes
app.get('/', (req, res) => {
  res.send('FutureAI API is running');
});

// Process AI request
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    // For demo purposes, return a simulated response
    // In production, you would use OpenAI API here
    const simulatedResponse = `I processed your request: "${message}". This is a simulated AI response from the server. In a production environment, this would connect to OpenAI API.`;
    
    // In production, you would save the conversation to MongoDB
    /*
    await Conversation.findOneAndUpdate(
      { userId },
      { 
        $push: { 
          messages: [
            { role: 'user', content: message },
            { role: 'assistant', content: simulatedResponse }
          ] 
        } 
      },
      { upsert: true, new: true }
    );
    */
    
    res.json({ response: simulatedResponse });
  } catch (error) {
    console.error('Error processing chat request:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});