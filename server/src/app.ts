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

app.get("/", (req, res) => {
    res.json({
        message: "Hello world!"
    });
});

// 1. JavaScript Run API
app.post("/javascript/online-compiler", (req, res) => {
    const code = req.body.code;
    
    // Path changed to match your folder: temp/js/
    const tempDir = path.join(dirname, "temp", "js");
    const tempFile = path.join(tempDir, "main.js");

    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    fs.writeFileSync(tempFile, code);
    
    exec(`node "${tempFile}"`, (err, stdout, stderr) => {
        if (err) {
            return res.json({
                output: stderr || err.message
            });
        }
        res.json({
            output: stdout
        });
    });
});

// 2. Python Run API
app.post("/python/online-compiler", (req, res) => {
    const code = req.body.code;
    
    // Path changed to match your folder: temp/python/
    const tempDir = path.join(dirname, "temp", "python");
    console.log("tempDir:", tempDir); // /app/src/temp/python
    const tempFile = path.join(tempDir, "main.py");
    console.log("tempFile:", tempFile); // /app/src/temp/python/main.py

    // file create
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }
    
    fs.writeFileSync(tempFile, code);

    // Note: Python3 standard Docker slim image me perfect chalega
    exec(`python3 "${tempFile}"`, (err, stdout, stderr) => {
        if (err) {
            return res.json({
                output: stderr || err.message
            });
        }
        res.json({
            output: stdout
        });
    });
});

export default app;