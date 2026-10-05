import express from "express";
import { analyzeSkillGap, getSkillQuiz } from "../controllers/skillController.js";

const router = express.Router();

router.post("/analyze-gap", analyzeSkillGap);
router.get("/quiz", getSkillQuiz);

export default router;
