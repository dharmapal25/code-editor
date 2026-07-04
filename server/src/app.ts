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
app.use(cors())

app.get("/", (req, res) => {
    res.json({
        message: "Hello world!"
    });
});

// app.use(express.static(path.join(dirname)));

// Python Run API
app.post("/run", (req, res) => {

    const code = req.body.code;
    const tempDir = path.join(dirname, "temp");
    const tempFile = path.join(tempDir, "main.js");

    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    fs.writeFileSync(tempFile, code);
    exec(`node "${tempFile}"`, (err, stdout, stderr) => {
        if (err) {
            return res.json({
                output: stderr
            });
        }
        res.json({
            output: stdout
        });

    });

});

export default app;