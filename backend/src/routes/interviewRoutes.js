import express from "express";
import { startInterview, evaluateAnswer, finalizeInterview } from "../controllers/interviewController.js";

const router = express.Router();

router.post("/start", startInterview);
router.post("/evaluate", evaluateAnswer);
router.post("/finalize", finalizeInterview);

export default router;
