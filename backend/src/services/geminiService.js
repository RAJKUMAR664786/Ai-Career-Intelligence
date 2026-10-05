import { getGeminiClient, isGeminiConfigured, GEMINI_MODEL } from "../config/gemini.js";
import * as fallbackService from "./fallbackService.js";

// Helper to prevent hanging requests when network resets or offline
const withTimeout = (promise, ms = 2500) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`API Timeout after ${ms}ms`)), ms))
  ]);
};

// Helper to extract JSON from model text
const extractJson = (text) => {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (e) {
    // Try regex to match markdown code block ```json ... ```
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1]);
      } catch (err) {
        console.warn("Failed to parse extracted JSON block", err);
      }
    }
  }
  return null;
};

export const generateAcademicInsights = async (academicData) => {
  if (!isGeminiConfigured()) {
    return fallbackService.getAcademicInsights(academicData);
  }

  try {
    const ai = getGeminiClient();
    const prompt = `You are an expert academic advisor and career strategist.
Analyze the following student academic performance:
${JSON.stringify(academicData, null, 2)}

Provide a structured JSON output with the exact schema:
{
  "summary": "String explaining the student's academic trend and overall performance",
  "academicScore": 82, // calculated 0-100 score
  "trendStatus": "Improving" | "Stable" | "Declining",
  "attendanceStatus": "Good" | "Warning" | "Critical",
  "attendanceMessage": "String advice regarding attendance",
  "focusAreas": ["Item 1", "Item 2", "Item 3"],
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "areasToImprove": ["Area 1", "Area 2", "Area 3"]
}
Return ONLY valid JSON.`;

    const response = await withTimeout(ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt
    }), 2500);

    const parsed = extractJson(response?.text);
    return parsed || fallbackService.getAcademicInsights(academicData);
  } catch (err) {
    console.error("Gemini academic insights error, using fallback:", err.message);
    return fallbackService.getAcademicInsights(academicData);
  }
};

export const generateSkillGapAnalysis = async (skills, targetCareer) => {
  if (!isGeminiConfigured()) {
    return fallbackService.getSkillGapAnalysis(skills, targetCareer);
  }

  try {
    const ai = getGeminiClient();
    const prompt = `Analyze the student's current skills for target career "${targetCareer}":
Current Skills: ${JSON.stringify(skills, null, 2)}

Provide structured JSON:
{
  "targetCareer": "${targetCareer}",
  "requiredSkills": [
    { "name": "Skill Name", "required": 85 }
  ],
  "gapAnalysis": [
    { "skill": "Skill Name", "current": 80, "required": 90, "gap": -10, "priority": "High" | "Medium" | "Low" }
  ],
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3", "Suggestion 4", "Suggestion 5"],
  "learningPath": [
    { "step": 1, "title": "Topic", "desc": "Short description" }
  ]
}
Return ONLY valid JSON.`;

    const response = await withTimeout(ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt
    }), 2500);

    const parsed = extractJson(response?.text);
    return parsed || fallbackService.getSkillGapAnalysis(skills, targetCareer);
  } catch (err) {
    console.error("Gemini skill gap error, using fallback:", err.message);
    return fallbackService.getSkillGapAnalysis(skills, targetCareer);
  }
};

export const generateCareerRecommendations = async (studentProfile) => {
  if (!isGeminiConfigured()) {
    return fallbackService.getCareerRecommendations(studentProfile);
  }

  try {
    const ai = getGeminiClient();
    const prompt = `Analyze this comprehensive student profile across academics, skills, projects, certifications, interests, and self-assessment:
${JSON.stringify(studentProfile, null, 2)}

Recommend the top 5 careers, explainability reasons, fit score breakdown, and a personalized 6-phase learning roadmap.
Format as JSON:
{
  "topMatches": [
    { "role": "Role Name", "fitPercentage": 94, "isTopMatch": true }
  ],
  "selectedCareer": "AI/ML Engineer",
  "whyThisCareer": {
    "role": "AI/ML Engineer",
    "points": ["Reason 1", "Reason 2", "Reason 3", "Reason 4", "Reason 5", "Reason 6"],
    "improvementAreas": ["Area 1", "Area 2", "Area 3"]
  },
  "fitScoreBreakdown": {
    "overallScore": 94,
    "verdict": "Excellent Fit",
    "weights": {
      "skills": { "score": 40, "max": 40, "label": "Skills (40%)" },
      "academic": { "score": 25, "max": 25, "label": "Academic (25%)" },
      "interests": { "score": 20, "max": 20, "label": "Interests (20%)" },
      "projects": { "score": 15, "max": 15, "label": "Projects (15%)" }
    }
  },
  "roadmap": [
    { "phase": 1, "title": "Phase title", "duration": "4-6 weeks", "status": "Completed" | "In Progress" | "Upcoming", "topics": ["T1", "T2"] }
  ],
  "currentFocus": { "skill": "Skill", "progress": 65, "nextTopic": "Next topic" },
  "recommendedResources": [
    { "name": "Source", "desc": "Course name", "type": "Course", "link": "#" }
  ],
  "estimatedCompletion": "~ 6 Months"
}
Return ONLY valid JSON.`;

    const response = await withTimeout(ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt
    }), 2500);

    const parsed = extractJson(response?.text);
    return parsed || fallbackService.getCareerRecommendations(studentProfile);
  } catch (err) {
    console.error("Gemini career recommendation error, using fallback:", err.message);
    return fallbackService.getCareerRecommendations(studentProfile);
  }
};

export const analyzeResumeContent = async (resumeText, targetCareer = "Full Stack Developer") => {
  if (!isGeminiConfigured()) {
    return fallbackService.analyzeResume(resumeText, targetCareer);
  }

  try {
    const ai = getGeminiClient();
    const prompt = `You are a certified technical recruiter and ATS (Applicant Tracking System) expert.
Analyze the following resume text for the role "${targetCareer}":
"""
${resumeText}
"""

Provide an objective ATS-style score, extracted skills, missing skills, category scoring, and 5 actionable suggestions.
Format as JSON:
{
  "resumeScore": 84, // 0-100
  "scoreVerdict": "Good Score" | "Needs Improvement" | "Excellent",
  "scoreMessage": "One sentence summary verdict",
  "skillsDetected": ["Skill1", "Skill2"],
  "missingSkills": ["Missing1", "Missing2"],
  "feedbackBreakdown": [
    { "category": "Content Quality", "score": 82, "max": 100 },
    { "category": "Structure & Layout", "score": 78, "max": 100 },
    { "category": "Projects Impact", "score": 85, "max": 100 },
    { "category": "Skills Alignment", "score": 88, "max": 100 },
    { "category": "Overall Impact", "score": 84, "max": 100 }
  ],
  "improvementSuggestions": ["Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5"]
}
Return ONLY valid JSON.`;

    const response = await withTimeout(ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt
    }), 2500);

    const parsed = extractJson(response?.text);
    return parsed || fallbackService.analyzeResume(resumeText, targetCareer);
  } catch (err) {
    console.error("Gemini resume analysis error, using fallback:", err.message);
    return fallbackService.analyzeResume(resumeText, targetCareer);
  }
};

export const evaluateInterviewAnswerAI = async (role, question, answer, history = []) => {
  if (!isGeminiConfigured()) {
    return fallbackService.evaluateInterviewAnswer(role, history.length, answer);
  }

  try {
    const ai = getGeminiClient();
    const prompt = `You are an experienced technical interviewer evaluating a candidate for the position of "${role}".
Question asked: "${question}"
Candidate answer: "${answer}"
Interview History Count: ${history.length}

Evaluate the candidate's answer and produce:
1. Score out of 100
2. Constructive, encouraging feedback (strengths and what to improve)
3. If history length is less than 3, generate the next interview question (relevant, progressive difficulty). If history length >= 3, set isFinished: true.

Format as JSON:
{
  "score": 85,
  "feedback": "Feedback message",
  "isFinished": boolean,
  "nextQuestion": "Next question string or null",
  "nextQuestionType": "Technical" | "HR" | null
}
Return ONLY valid JSON.`;

    const response = await withTimeout(ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt
    }), 2500);

    const parsed = extractJson(response?.text);
    return parsed || fallbackService.evaluateInterviewAnswer(role, history.length, answer);
  } catch (err) {
    console.error("Gemini interview eval error, using fallback:", err.message);
    return fallbackService.evaluateInterviewAnswer(role, history.length, answer);
  }
};
