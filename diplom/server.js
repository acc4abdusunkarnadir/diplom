import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/diplom", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB error:", err));

// MongoDB Schema
const WordSchema = new mongoose.Schema({
    kazakh: String,
    english: String,
});
const Word = mongoose.model("Word", WordSchema);

// MongoDB Schema for scores
const ScoreSchema = new mongoose.Schema({
    username: String,
    score: Number,
    quizType: String,
    date: { type: Date, default: Date.now }
});
const Score = mongoose.model("Score", ScoreSchema);

// MongoDB Schema for users
const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    date: { type: Date, default: Date.now }
});
const User = mongoose.model("User", UserSchema);

// OpenAI setup


async function completeChat(prompt) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: prompt }
            ],
            max_tokens: 100,
            temperature: 0.7
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error("OpenAI API error:", error.message);
        return "Error connecting to AI service.";
    }
}

// Save a word
app.post("/api/words", async (req, res) => {
    const { kazakh, english } = req.body;
    try {
        const word = new Word({ kazakh, english });
        await word.save();
        res.status(201).json(word);
    } catch (err) {
        res.status(500).json({ error: "Failed to save word" });
    }
});

// Get all words
app.get("/api/words", async (req, res) => {
    try {
        const words = await Word.find();
        res.json(words);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch words" });
    }
});

// Save a user's score
app.post("/api/scores", async (req, res) => {
    const { username, score, quizType } = req.body;
    try {
        const newScore = new Score({ username, score, quizType });
        await newScore.save();
        res.status(201).json(newScore);
    } catch (err) {
        res.status(500).json({ error: "Failed to save score" });
    }
});

// Get competitive scores - this needs to come BEFORE the general scores endpoint
app.get("/api/scores/competitive", async (req, res) => {
    try {
        const scores = await Score.find({ quizType: "competitive" })
            .sort({ score: -1 })
            .limit(10);
        res.json(scores);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch competitive scores" });
    }
});

// Get all scores (for leaderboard)
app.get("/api/scores", async (req, res) => {
    try {
        const scores = await Score.find().sort({ score: -1 });
        res.json(scores);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch scores" });
    }
});

// Save a user account
app.post("/api/users", async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: "Failed to save user" });
    }
});

// Login endpoint
app.post("/api/users/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (user) {
            res.json({ username: user.username, id: user._id });
        } else {
            res.status(401).json({ error: "Invalid username or password" });
        }
    } catch (err) {
        res.status(500).json({ error: "Failed to authenticate user" });
    }
});

// Get all users (for admin purposes)
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// Chat endpoint using ChatGPT
app.post("/chat", async (req, res) => {
    try {
        const userInput = req.body.message || "";
        if (!userInput) {
            return res.status(400).json({ error: "Empty message" });
        }

        const reply = await completeChat(userInput);
        res.json({ reply });
    } catch (error) {
        console.error("Chat error:", error.message);
        res.status(500).json({ error: "Failed to get reply" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
