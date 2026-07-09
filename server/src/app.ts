import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import langRoute from "./routes/languages.route.js";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const app = express();
app.use(express.json());
app.use(cors());

// Health API
app.get("/api", (req, res) => {
    res.json({
        message: "Backend Running "
    });
});

app.use("/api", langRoute);

// React Frontend Static Middleware
const publicPath = path.join(dirname, "../public");
app.use(express.static(publicPath));

// Catch-all route for React
app.use((req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

export default app;