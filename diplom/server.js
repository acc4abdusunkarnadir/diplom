

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/diplom", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB error:", err));

const WordSchema = new mongoose.Schema({
    kazakh: String,
    english: String,
});
const Word = mongoose.model("Word", WordSchema);

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

app.get("/api/words", async (req, res) => {
    try {
        const words = await Word.find();
        res.json(words);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch words" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
