import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import OpenAI from "openai";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;

// Configure CORS
app.use(cors({
    origin: 'http://localhost:5173', // Vue dev server default port
    credentials: true
}));

app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// MongoDB Schema for users with level
const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    level: {
        type: String,
        enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        required: true
    },
    date: { type: Date, default: Date.now }
});
const User = mongoose.model("User", UserSchema);

// MongoDB Schema for words with levels
const WordSchema = new mongoose.Schema({
    kazakh: String,
    english: String,
    level: {
        type: String,
        enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        required: true
    }
});
const Word = mongoose.model("Word", WordSchema);

// MongoDB Schema for scores
const ScoreSchema = new mongoose.Schema({
    username: String,
    score: Number,
    quizType: String,
    level: String,
    date: { type: Date, default: Date.now }
});
const Score = mongoose.model("Score", ScoreSchema);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/kazakh_learning')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Sign up endpoint
app.post("/api/signup", async (req, res) => {
    try {
        const { username, password, level } = req.body;

        // Validate required fields
        if (!username || !password || !level) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Validate level
        if (!['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(level)) {
            return res.status(400).json({ error: "Invalid level" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // Create new user
        const user = new User({
            username,
            password, // Note: In production, hash the password
            level
        });

        await user.save();
        res.json({
            message: "User created successfully",
            user: {
                username: user.username,
                level: user.level
            }
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Failed to create user" });
    }
});

// Sign in endpoint
app.post("/api/signin", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate required fields
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const user = await User.findOne({ username, password }); // Note: In production, use proper password comparison
        if (!user) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        res.json({
            message: "Login successful",
            user: {
                username: user.username,
                level: user.level
            }
        });
    } catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({ error: "Failed to sign in" });
    }
});

// Get user level endpoint
app.get("/api/user/:username/level", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ level: user.level });
    } catch (error) {
        console.error("Get level error:", error);
        res.status(500).json({ error: "Failed to get user level" });
    }
});

// Get words by level endpoint
app.get("/api/words/:level", async (req, res) => {
    try {
        const words = await Word.find({ level: req.params.level });
        res.json(words);
    } catch (error) {
        console.error("Get words error:", error);
        res.status(500).json({ error: "Failed to get words" });
    }
});

// Update user level endpoint
app.put("/api/user/:username/level", async (req, res) => {
    try {
        const { level } = req.body;
        if (!['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(level)) {
            return res.status(400).json({ error: "Invalid level" });
        }

        const user = await User.findOneAndUpdate(
            { username: req.params.username },
            { level },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "Level updated successfully", level: user.level });
    } catch (error) {
        console.error("Update level error:", error);
        res.status(500).json({ error: "Failed to update level" });
    }
});

// Submit score endpoint
app.post("/api/scores", async (req, res) => {
    try {
        const { username, score, quizType, level } = req.body;
        const newScore = new Score({
            username,
            score,
            quizType,
            level
        });
        await newScore.save();
        res.json({ message: "Score submitted successfully" });
    } catch (error) {
        console.error("Submit score error:", error);
        res.status(500).json({ error: "Failed to submit score" });
    }
});

// Get leaderboard by level
app.get("/api/leaderboard/:level", async (req, res) => {
    try {
        const scores = await Score.find({ level: req.params.level })
            .sort({ score: -1 })
            .limit(10);
        res.json(scores);
    } catch (error) {
        console.error("Get leaderboard error:", error);
        res.status(500).json({ error: "Failed to get leaderboard" });
    }
});

// Grammar check endpoint
app.post("/api/grammar-check", async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: "Text is required" });
        }

        console.log('Sending request to Python service:', { text: text.substring(0, 100) + '...' });

        const response = await fetch('http://127.0.0.1:5000/check-grammar', {
            method: 'POST',
         headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });

        console.log('Python service response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Python service error response:', errorText);
            throw new Error(`Failed to get response from grammar service: ${errorText}`);
        }

        const data = await response.json();
        console.log('Python service response:', data);
        res.json(data);
    } catch (error) {
        console.error("Grammar check error:", error);
        res.status(500).json({
            error: "Failed to check grammar",
            details: error.message
        });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
