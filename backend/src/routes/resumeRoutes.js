import express from "express";
import multer from "multer";
import path from "path";
import { analyzeResume } from "../controllers/resumeController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max as specified in mockup
});

router.post("/analyze", upload.single("resumeFile"), analyzeResume);

export default router;
