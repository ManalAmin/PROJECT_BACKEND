const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Mock Database (for testing)
let projects = [];

// 1️⃣ Root Route
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// 2️⃣ GET all projects
app.get("/api/projects", (req, res) => {
    res.json({ status: "success", projects });
});

// 3️⃣ GET total number of projects
app.get("/api/projects/count", (req, res) => {
    res.json({ status: "success", count: projects.length });
});

// 4️⃣ POST - Add a new project
app.post("/api/projects", (req, res) => {
    const projectName = req.body.name?.trim();

    // Validation: Check if name is at least 3 characters long
    if (!projectName || projectName.length < 3) {
        return res.status(400).json({ status: "error", message: "Project name must be at least 3 characters" });
    }

    // Validation: Prevent duplicate names (case-insensitive)
    if (projects.some(p => p.name.toLowerCase() === projectName.toLowerCase())) {
        return res.status(400).json({ status: "error", message: "Project name already exists" });
    }

    const newProject = { id: projects.length + 1, name: projectName };
    projects.push(newProject);

    res.status(201).json({ status: "success", project: newProject });
});

// 5️⃣ DELETE - Remove a single project
app.delete("/api/projects/:id", (req, res) => {
    const projectId = parseInt(req.params.id);
    const index = projects.findIndex(p => p.id === projectId);

    if (index === -1) {
        return res.status(404).json({ status: "error", message: "Project not found" });
    }

    const deletedProject = projects.splice(index, 1)[0];
    res.json({ status: "success", deletedProject });
});

// 6️⃣ DELETE - Remove all projects
app.delete("/api/projects", (req, res) => {
    projects = []; // Clear all projects
    res.json({ status: "success", message: "All projects deleted" });
});

// Start the server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
