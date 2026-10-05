import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

export const api = {
  checkHealth: () => apiClient.get("/health"),
  getAcademicInsights: (academicData) => apiClient.post("/academic/insights", academicData),
  analyzeSkillGap: (skills, targetCareer) => apiClient.post("/skills/analyze-gap", { skills, targetCareer }),
  getSkillQuiz: (skillName) => apiClient.get(`/skills/quiz?skillName=${encodeURIComponent(skillName)}`),
  getCareerRecommendations: (profile) => apiClient.post("/career/recommend", profile),
  analyzeResume: (formData) => apiClient.post("/resume/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  startInterview: (role, difficulty, interviewType) => apiClient.post("/interview/start", { role, difficulty, interviewType }),
  evaluateInterviewAnswer: (role, question, answer, history) => apiClient.post("/interview/evaluate", { role, question, answer, history }),
  finalizeInterview: (role, sessionData) => apiClient.post("/interview/finalize", { role, sessionData })
};

export default api;
