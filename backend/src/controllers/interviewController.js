import * as fallbackService from "../services/fallbackService.js";
import * as geminiService from "../services/geminiService.js";

export const startInterview = async (req, res) => {
  try {
    const { role = "Full Stack Developer", difficulty = "Intermediate", interviewType = "Technical + HR" } = req.body;
    const session = fallbackService.startInterview(role, difficulty, interviewType);
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const evaluateAnswer = async (req, res) => {
  try {
    const { role = "Full Stack Developer", question = "", answer = "", history = [] } = req.body;
    const evaluation = await geminiService.evaluateInterviewAnswerAI(role, question, answer, history);
    res.json({ success: true, data: evaluation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const finalizeInterview = async (req, res) => {
  try {
    const { role = "Full Stack Developer", sessionData = {} } = req.body;
    const finalReport = fallbackService.finalizeInterview(role);
    res.json({ success: true, data: finalReport });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
