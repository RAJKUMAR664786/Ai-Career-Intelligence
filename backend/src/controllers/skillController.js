import * as geminiService from "../services/geminiService.js";
import * as fallbackService from "../services/fallbackService.js";

export const analyzeSkillGap = async (req, res) => {
  try {
    const { skills = [], targetCareer = "AI/ML Engineer" } = req.body;
    const result = await geminiService.generateSkillGapAnalysis(skills, targetCareer);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSkillQuiz = async (req, res) => {
  try {
    const skill = req.query.skillName || req.query.skill || "Python";
    const quiz = fallbackService.getSkillQuiz(skill);
    res.json({ success: true, data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
