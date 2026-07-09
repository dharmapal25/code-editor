import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// JavaScript Compiler Logic
export const compileJavaScript = (req: any, res: any) => {
    const code = req.body.code;

    const tempDir = path.join(dirname, "..", "temp", "js");
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
        res.json({ output: stdout });
    });
};

// Python Compiler Logic
export const compilePython = (req: any, res: any) => {
    const code = req.body.code;

    const tempDir = path.join(dirname, "..", "temp", "python");
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
        res.json({ output: stdout });
    });
};

// Java Compiler Logic
export const compileJava = (req: any, res: any) => {
    const code = req.body.code;

    const tempDir = path.join(dirname, "..", "temp", "java");
    const tempFile = path.join(tempDir, "Main.java");

    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    fs.writeFileSync(tempFile, code);

    // Pehle compile (javac), fir run (java) - dono tempDir ke andar
    exec(`javac Main.java && java Main`, { cwd: tempDir, timeout: 10000 }, (err, stdout, stderr) => {
        if (err) {
            return res.json({
                output: stderr || err.message || "Execution failed"
            });
        }
        res.json({ output: stdout });
    });
};