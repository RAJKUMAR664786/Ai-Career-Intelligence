import * as geminiService from "../services/geminiService.js";

export const getCareerRecommendations = async (req, res) => {
  try {
    const studentProfile = req.body || {};
    const recommendations = await geminiService.generateCareerRecommendations(studentProfile);
    res.json({ success: true, data: recommendations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
