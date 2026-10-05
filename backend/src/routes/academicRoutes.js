import express from "express";
import { getAcademicInsights } from "../controllers/academicController.js";

const router = express.Router();

router.post("/insights", getAcademicInsights);

export default router;
