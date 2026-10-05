import * as geminiService from "../services/geminiService.js";

export const getAcademicInsights = async (req, res) => {
  try {
    const academicData = req.body || {};
    const insights = await geminiService.generateAcademicInsights(academicData);
    res.json({ success: true, data: insights });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
