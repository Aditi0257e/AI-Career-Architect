const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/resumeDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Define Schema
const resumeSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    jobDescription: String,
    skills: [String],
});

// Create Model
const Resume = mongoose.model("Resume", resumeSchema);

// API to save resume data
app.post("/generate-resume", async (req, res) => {
    try {
        const { name, email, phone, jobDescription, skills } = req.body;

        if (!name || !email || !phone || !jobDescription || !skills) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        const newResume = new Resume({
            name,
            email,
            phone,
            jobDescription,
            skills: skills.split(",").map((s) => s.trim()), // Ensure skills are an array
        });

        await newResume.save();
        res.json({ message: "✅ Resume saved successfully!" });
    } catch (error) {
        console.error("❌ Error generating resume:", error);
        res.status(500).json({ error: "Error generating resume" });
    }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
