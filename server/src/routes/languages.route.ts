import { Router } from "express";
import { compileJavaScript, compilePython, compileJava } from "../controllers/languages.controller.js";

const router = Router();

// Compiler Routes mapping to controllers
router.post("/javascript/online-compiler", compileJavaScript);
router.post("/python/online-compiler", compilePython);
router.post("/java/online-compiler", compileJava);

export default router;