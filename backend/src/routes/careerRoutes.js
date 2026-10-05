import express from "express";
import { getCareerRecommendations } from "../controllers/careerController.js";

const router = express.Router();

router.post("/recommend", getCareerRecommendations);

export default router;
