import fs from "fs";
import pdfParse from "pdf-parse";
import * as geminiService from "../services/geminiService.js";

export const analyzeResume = async (req, res) => {
  try {
    let resumeText = req.body?.resumeText || "";
    const targetCareer = req.body?.targetCareer || "Full Stack Developer";

    if (req.file) {
      const filePath = req.file.path;
      const fileBuffer = fs.readFileSync(filePath);
      
      if (req.file.mimetype === "application/pdf" || req.file.originalname.endsWith(".pdf")) {
        try {
          const pdfData = await pdfParse(fileBuffer);
          resumeText = pdfData.text || "";
        } catch (pdfErr) {
          console.warn("PDF parse error, using raw string buffer", pdfErr.message);
          resumeText = fileBuffer.toString("utf8");
        }
      } else {
        resumeText = fileBuffer.toString("utf8");
      }

      // cleanup uploaded temp file
      try {
        fs.unlinkSync(filePath);
      } catch (e) {}
    }

    if (!resumeText || resumeText.trim().length === 0) {
      resumeText = "Rahul Sharma, B.Tech IT student. Skills: Python, React, JavaScript, SQL, MongoDB. Projects: Smart Attendance System using OpenCV & SQLite, Fullstack E-Commerce portal.";
    }

    const analysis = await geminiService.analyzeResumeContent(resumeText, targetCareer);
    res.json({ success: true, data: analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
