import express from "express";
import fs from "fs";
import cors from "cors";
import path from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const app = express();

app.use(express.json());
app.use(cors());


app.get("/api", (req, res) => {
    res.json({
        message: "Backend Running 🚀"
    });
});

// JavaScript Compiler
app.post("/api/javascript/online-compiler", (req, res) => {

    const code = req.body.code;

    const tempDir = path.join(dirname, "temp", "js");
    const tempFile = path.join(tempDir, "main.js");

    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    fs.writeFileSync(tempFile, code);

    exec(`node "${tempFile}"`, { timeout: 10000 }, (err, stdout, stderr) => {

        if (err) {
            return res.json({
                output: stderr || err.message || "Execution failed"
            });
        }

        res.json({
            output: stdout
        });

    });

});

// Python Compiler
app.post("/api/python/online-compiler", (req, res) => {

    const code = req.body.code;

    const tempDir = path.join(dirname, "temp", "python");
    const tempFile = path.join(tempDir, "main.py");
    const pythonCommand = process.platform === "win32" ? "python" : "python3";

    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    fs.writeFileSync(tempFile, code);

    exec(`${pythonCommand} "${tempFile}"`, { timeout: 10000 }, (err, stdout, stderr) => {

        if (err) {
            return res.json({
                output: stderr || err.message || "Execution failed"
            });
        }

        res.json({
            output: stdout
        });

    });

});




//    React Frontend
const publicPath = path.join(dirname, "../public");

app.use(express.static(publicPath));

// Catch all routes
app.use((req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

export default app;