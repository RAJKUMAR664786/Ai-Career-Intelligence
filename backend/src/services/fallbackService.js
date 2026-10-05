import { SKILL_QUIZZES, getSkillQuiz } from "./skillTestsBank.js";
import { INTERVIEW_QUESTIONS_BANK } from "./interviewBank.js";

export { SKILL_QUIZZES, getSkillQuiz, INTERVIEW_QUESTIONS_BANK };

export const CAREER_BENCHMARKS = {
  "AI/ML Engineer": {
    requiredSkills: [
      { name: "Python", required: 90 },
      { name: "Machine Learning", required: 85 },
      { name: "Statistics", required: 80 },
      { name: "TensorFlow", required: 70 },
      { name: "SQL", required: 75 },
      { name: "Data Analysis", required: 65 }
    ],
    roadmap: [
      { phase: 1, title: "Python & Math", duration: "4-6 weeks", status: "Completed", topics: ["Python OOP", "Linear Algebra", "Calculus", "NumPy & Pandas"] },
      { phase: 2, title: "Statistics", duration: "4-6 weeks", status: "Completed", topics: ["Descriptive Stats", "Hypothesis Testing", "Probability Distributions", "Bayesian Methods"] },
      { phase: 3, title: "Machine Learning", duration: "6-8 weeks", status: "In Progress", topics: ["Supervised Learning", "Classification & Regression", "Scikit-Learn", "Model Evaluation"] },
      { phase: 4, title: "Deep Learning", duration: "6-8 weeks", status: "Upcoming", topics: ["Neural Networks", "TensorFlow & PyTorch", "CNNs & RNNs", "Transformers"] },
      { phase: 5, title: "Projects", duration: "4-6 weeks", status: "Upcoming", topics: ["End-to-end ML Pipeline", "Computer Vision App", "NLP Sentiment Analyzer"] },
      { phase: 6, title: "Deployment", duration: "2-4 weeks", status: "Upcoming", topics: ["Docker Containerization", "FastAPI Serving", "MLflow", "Cloud Deployment"] }
    ],
    currentFocus: { skill: "Machine Learning", progress: 65, nextTopic: "Linear Regression & Regularization" },
    estimatedCompletion: "~ 6 Months"
  },
  "Data Scientist": {
    requiredSkills: [
      { name: "Python", required: 85 },
      { name: "Machine Learning", required: 80 },
      { name: "Statistics", required: 90 },
      { name: "SQL", required: 85 },
      { name: "Data Visualization", required: 80 },
      { name: "Data Analysis", required: 85 }
    ],
    roadmap: [
      { phase: 1, title: "Data Wrangling", duration: "4-5 weeks", status: "Completed", topics: ["Pandas", "Data Cleaning", "Feature Engineering"] },
      { phase: 2, title: "Advanced Statistics", duration: "4-6 weeks", status: "In Progress", topics: ["A/B Testing", "Time Series", "Multivariate Analysis"] },
      { phase: 3, title: "Predictive Modeling", duration: "6-8 weeks", status: "Upcoming", topics: ["Ensemble Trees", "XGBoost", "Clustering"] },
      { phase: 4, title: "Business Storytelling", duration: "3-4 weeks", status: "Upcoming", topics: ["Tableau", "PowerBI", "Executive Dashboards"] },
      { phase: 5, title: "Big Data & Production", duration: "4-6 weeks", status: "Upcoming", topics: ["Spark", "SQL Data Warehouses", "Pipeline CI/CD"] }
    ],
    currentFocus: { skill: "Advanced Statistics", progress: 50, nextTopic: "A/B Testing Methodology" },
    estimatedCompletion: "~ 5 Months"
  },
  "Full Stack Developer": {
    requiredSkills: [
      { name: "JavaScript", required: 90 },
      { name: "React", required: 85 },
      { name: "SQL", required: 75 },
      { name: "Firebase", required: 70 },
      { name: "Data Structures", required: 80 },
      { name: "Computer Networks", required: 75 }
    ],
    roadmap: [
      { phase: 1, title: "Modern JavaScript", duration: "3-4 weeks", status: "Completed", topics: ["ES6+", "Async/Await", "DOM Manipulation"] },
      { phase: 2, title: "Frontend with React", duration: "5-6 weeks", status: "Completed", topics: ["React Hooks", "State Management", "Component Design"] },
      { phase: 3, title: "Backend API Dev", duration: "5-6 weeks", status: "In Progress", topics: ["Express.js", "RESTful Architecture", "JWT Auth"] },
      { phase: 4, title: "Databases & ORM", duration: "4-5 weeks", status: "Upcoming", topics: ["PostgreSQL", "Prisma", "MongoDB"] },
      { phase: 5, title: "Full Stack Deployment", duration: "3-4 weeks", status: "Upcoming", topics: ["Docker", "Vercel / Render", "CI/CD Actions"] }
    ],
    currentFocus: { skill: "Backend API Dev", progress: 60, nextTopic: "Authentication & Middleware" },
    estimatedCompletion: "~ 4 Months"
  },
  "Cloud Engineer": {
    requiredSkills: [
      { name: "Cloud & DevOps", required: 85 },
      { name: "Computer Networks", required: 80 },
      { name: "Python", required: 75 },
      { name: "SQL", required: 70 },
      { name: "Data Structures", required: 70 }
    ],
    roadmap: [
      { phase: 1, title: "Linux & Networking", duration: "4-5 weeks", status: "Completed", topics: ["Linux CLI", "TCP/IP & DNS", "SSH & Security"] },
      { phase: 2, title: "Cloud Fundamentals", duration: "4-6 weeks", status: "In Progress", topics: ["AWS / GCP Core Services", "VPC & IAM", "Storage"] },
      { phase: 3, title: "Containers & Orchestration", duration: "6-7 weeks", status: "Upcoming", topics: ["Dockerfiles", "Kubernetes Pods & Services", "Helm"] },
      { phase: 4, title: "Infrastructure as Code", duration: "4-5 weeks", status: "Upcoming", topics: ["Terraform", "CI/CD Pipelines", "Monitoring"] }
    ],
    currentFocus: { skill: "Cloud Fundamentals", progress: 55, nextTopic: "VPC Peering & Security Groups" },
    estimatedCompletion: "~ 5 Months"
  },
  "Data Analyst": {
    requiredSkills: [
      { name: "SQL", required: 90 },
      { name: "Data Analysis", required: 85 },
      { name: "Statistics", required: 80 },
      { name: "Python", required: 75 }
    ],
    roadmap: [
      { phase: 1, title: "Advanced SQL", duration: "3-4 weeks", status: "Completed", topics: ["Window Functions", "CTEs", "Query Optimization"] },
      { phase: 2, title: "BI Dashboards", duration: "4-5 weeks", status: "Completed", topics: ["Power BI", "Tableau", "KPI Design"] },
      { phase: 3, title: "Python for Data Analysis", duration: "4-5 weeks", status: "In Progress", topics: ["Pandas", "Matplotlib", "Seaborn"] },
      { phase: 4, title: "Statistical Insights", duration: "3-4 weeks", status: "Upcoming", topics: ["Correlation vs Causation", "Hypothesis Tests"] }
    ],
    currentFocus: { skill: "Python for Data Analysis", progress: 70, nextTopic: "Exploratory Data Analysis (EDA)" },
    estimatedCompletion: "~ 3.5 Months"
  }
};

export const getAcademicInsights = (academicData) => {
  const cgpa = academicData?.cgpa || 8.24;
  const attendance = academicData?.attendance || 91;

  let trendStatus = "Improving";
  if (cgpa < 7.5) trendStatus = "Declining";
  else if (cgpa < 8.0) trendStatus = "Stable";

  return {
    summary: `Your academic performance shows consistent ${trendStatus.toLowerCase()} momentum with a CGPA of ${cgpa}. You have strong conceptual foundation in core computer science subjects.`,
    academicScore: Math.round(cgpa * 10),
    trendStatus,
    attendanceStatus: attendance >= 85 ? "Good" : attendance >= 75 ? "Warning" : "Critical",
    attendanceMessage: attendance >= 85 ? "You are in safe zone. Keep it up!" : "Warning: Ensure attendance stays above 75% for placement eligibility.",
    focusAreas: [
      "Improve Mathematics & Discrete Structures performance",
      "Strengthen Computer Networks and Protocol Architecture concepts",
      "Maintain your current positive GPA momentum into final year"
    ],
    strengths: [
      "Programming & Algorithmic Skills",
      "Consistent Academic Performance",
      `Excellent Attendance (${attendance}%)`,
      "Quick Technical Learner"
    ],
    areasToImprove: [
      "Mathematics & Statistical Formulation",
      "Computer Networks Protocols",
      "Competitive Problem Solving Speed"
    ]
  };
};

export const getSkillGapAnalysis = (currentSkills = [], targetCareer = "AI/ML Engineer") => {
  const benchmark = CAREER_BENCHMARKS[targetCareer] || CAREER_BENCHMARKS["AI/ML Engineer"];
  
  const currentSkillsMap = {};
  currentSkills.forEach(s => {
    currentSkillsMap[s.name?.toLowerCase()] = s.level || 0;
  });

  const gapAnalysis = benchmark.requiredSkills.map(req => {
    const currentLvl = currentSkillsMap[req.name.toLowerCase()] !== undefined 
      ? currentSkillsMap[req.name.toLowerCase()] 
      : 30;

    const gap = currentLvl - req.required;
    let priority = "Low";
    if (gap <= -30) priority = "High";
    else if (gap < 0) priority = "Medium";

    return {
      skill: req.name,
      current: currentLvl,
      required: req.required,
      gap: gap,
      priority: priority
    };
  });

  const highPriority = gapAnalysis.filter(g => g.priority === "High").map(g => g.skill);
  const suggestions = [
    highPriority.length > 0 ? `Strengthen ${highPriority.join(" and ")} as top urgency` : "Maintain your verified skills with practical projects",
    `Target 80%+ benchmark across all ${targetCareer} core competencies`,
    "Take dedicated skill verification tests to upgrade your verified placement readiness",
    "Build a production-grade portfolio project showcasing end-to-end implementation",
    "Practice mock interviews to articulate your technical design choices"
  ];

  const learningPath = [
    { step: 1, title: "Core Fundamentals", desc: "Solidify base language and data structures" },
    { step: 2, title: "Domain Foundations", desc: `Master target concepts for ${targetCareer}` },
    { step: 3, title: "Hands-on Frameworks", desc: "Build feature-complete applications" },
    { step: 4, title: "Projects & Verification", desc: "Complete skill assessments & open-source contributions" },
    { step: 5, title: "System Design & Placement Prep", desc: "Ace technical & behavioral interview rounds" }
  ];

  return {
    targetCareer,
    requiredSkills: benchmark.requiredSkills,
    gapAnalysis,
    suggestions,
    learningPath
  };
};

export const getCareerRecommendations = (studentProfile) => {
  const skills = studentProfile?.skills || [];
  const skillsMap = {};
  skills.forEach(s => { skillsMap[s.name.toLowerCase()] = s.level; });

  const calculateSuitability = (benchmarkRole) => {
    const bench = CAREER_BENCHMARKS[benchmarkRole];
    if (!bench) return 80;
    let totalScore = 0;
    bench.requiredSkills.forEach(req => {
      const cur = skillsMap[req.name.toLowerCase()] || 35;
      const match = Math.min((cur / req.required) * 100, 100);
      totalScore += match;
    });
    const avgSkillFit = Math.round(totalScore / bench.requiredSkills.length);
    const academicFit = Math.min(Math.round(((studentProfile?.academicInfo?.cgpa || 8.0) / 10) * 100), 100);
    return Math.round((avgSkillFit * 0.6) + (academicFit * 0.4));
  };

  const aimlFit = calculateSuitability("AI/ML Engineer");
  const dsFit = calculateSuitability("Data Scientist");
  const fsFit = calculateSuitability("Full Stack Developer");
  const cloudFit = calculateSuitability("Cloud Engineer");
  const daFit = calculateSuitability("Data Analyst");

  const topMatches = [
    { role: "AI/ML Engineer", fitPercentage: Math.max(aimlFit, 75), isTopMatch: false },
    { role: "Data Scientist", fitPercentage: Math.max(dsFit, 70), isTopMatch: false },
    { role: "Full Stack Developer", fitPercentage: Math.max(fsFit, 70), isTopMatch: false },
    { role: "Data Analyst", fitPercentage: Math.max(daFit, 65), isTopMatch: false },
    { role: "Cloud Engineer", fitPercentage: Math.max(cloudFit, 65), isTopMatch: false }
  ].sort((a, b) => b.fitPercentage - a.fitPercentage);

  topMatches[0].isTopMatch = true;
  const topRole = topMatches[0].role;

  return {
    topMatches,
    selectedCareer: topRole,
    whyThisCareer: {
      role: topRole,
      points: [
        `Strong verified alignment with core ${topRole} prerequisites`,
        "Consistent academic GPA growth across semesters",
        "Demonstrated project practical implementation experience",
        "High logical reasoning & algorithmic problem solving aptitude",
        "Clear progress in technical assessment tests",
        "Industry-relevant tech stack familiarity"
      ],
      improvementAreas: [
        "Complete advanced project deployments on cloud platforms",
        "Deepen system architecture & performance tuning knowledge",
        "Practice timed behavioral and technical mock interviews"
      ]
    },
    fitScoreBreakdown: {
      overallScore: topMatches[0].fitPercentage,
      verdict: topMatches[0].fitPercentage >= 85 ? "Excellent Fit" : "Promising Fit",
      weights: {
        skills: { score: Math.round(topMatches[0].fitPercentage * 0.4), max: 40, label: "Skills (40%)" },
        academic: { score: Math.round(((studentProfile?.academicInfo?.cgpa || 8.24) / 10) * 25), max: 25, label: "Academic (25%)" },
        interests: { score: 20, max: 20, label: "Interests (20%)" },
        projects: { score: 15, max: 15, label: "Projects (15%)" }
      }
    },
    roadmap: CAREER_BENCHMARKS[topRole]?.roadmap || CAREER_BENCHMARKS["AI/ML Engineer"].roadmap,
    currentFocus: CAREER_BENCHMARKS[topRole]?.currentFocus || CAREER_BENCHMARKS["AI/ML Engineer"].currentFocus,
    recommendedResources: [
      { name: "Coursera", desc: `${topRole} Masterclass & Specialization`, type: "Course", link: "https://coursera.org" },
      { name: "Kaggle / LeetCode", desc: "Hands-on Datasets & Problem Sets", type: "Practice", link: "https://kaggle.com" },
      { name: "YouTube", desc: "In-depth Technical System Architecture", type: "Tutorials", link: "https://youtube.com" },
      { name: "Documentation", desc: "Official Upstream Production Best Practices", type: "Reading", link: "#" }
    ],
    estimatedCompletion: "~ 5-6 Months"
  };
};

export const analyzeResume = (resumeText = "", targetCareer = "Full Stack Developer") => {
  const textLower = resumeText.toLowerCase();
  
  const allPotentialSkills = ["python", "react", "sql", "javascript", "mongodb", "html", "css", "git", "docker", "aws", "rest api", "node.js", "express", "machine learning"];
  const detected = allPotentialSkills.filter(s => textLower.includes(s));
  const detectedFormatted = detected.length > 0 
    ? detected.map(s => s.toUpperCase()) 
    : ["PYTHON", "REACT", "SQL", "JAVASCRIPT", "MONGODB", "HTML", "CSS", "GIT"];

  const missing = ["REST APIs", "System Design", "Docker", "AWS Cloud", "Unit Testing", "CI/CD"].filter(m => !textLower.includes(m.toLowerCase()));

  const resumeScore = Math.min(65 + (detected.length * 3), 96);

  return {
    resumeScore,
    scoreVerdict: resumeScore >= 80 ? "Good Score" : "Needs Optimization",
    scoreMessage: resumeScore >= 80 
      ? "Your resume is strong! High keyword match for product placement rounds." 
      : "Resume parsed! Add quantifiable metrics and missing technical keywords to boost ATS ranking.",
    skillsDetected: detectedFormatted,
    missingSkills: missing.slice(0, 4),
    feedbackBreakdown: [
      { category: "Content Quality", score: Math.min(resumeScore - 2, 95), max: 100 },
      { category: "Structure & Layout", score: Math.min(resumeScore - 6, 90), max: 100 },
      { category: "Projects Impact", score: Math.min(resumeScore + 2, 98), max: 100 },
      { category: "Skills Alignment", score: Math.min(resumeScore + 4, 100), max: 100 },
      { category: "Overall Impact", score: resumeScore, max: 100 }
    ],
    improvementSuggestions: [
      "Add quantifiable metrics to project bullet points (e.g. 'Reduced latency by 35% using indexing')",
      "Include key technical keywords: REST APIs, System Design, and CI/CD Automation",
      "Adopt the STAR method (Situation, Task, Action, Result) in your project experience descriptions",
      "Organize technical skills into distinct subcategories (Languages, Frameworks, Cloud, Databases)",
      "Include active GitHub repository links and verifiable live demo URLs"
    ]
  };
};

export const startInterview = (role = "Full Stack Developer", difficulty = "Intermediate", interviewType = "Technical + HR") => {
  const bank = INTERVIEW_QUESTIONS_BANK[role] || INTERVIEW_QUESTIONS_BANK["Full Stack Developer"];
  const firstQuestion = bank[0];

  return {
    sessionId: `interview_${Date.now()}`,
    role,
    difficulty,
    interviewType,
    currentQuestionIndex: 0,
    totalQuestions: bank.length,
    question: firstQuestion.question,
    questionType: firstQuestion.type,
    roundTitle: firstQuestion.round,
    questionId: firstQuestion.id,
    timeLimitSeconds: 90
  };
};

export const evaluateInterviewAnswer = (role, questionIndex, answer = "") => {
  const bank = INTERVIEW_QUESTIONS_BANK[role] || INTERVIEW_QUESTIONS_BANK["Full Stack Developer"];
  const currentQ = bank[questionIndex] || bank[0];
  const nextIndex = questionIndex + 1;
  const isFinished = nextIndex >= bank.length;

  const textLower = answer.trim().toLowerCase();
  const words = textLower.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  let matchedKeywords = 0;
  if (currentQ && currentQ.idealKeywords) {
    currentQ.idealKeywords.forEach(kw => {
      if (textLower.includes(kw.toLowerCase())) matchedKeywords++;
    });
  }

  let technicalScore = 70;
  let communicationScore = 72;
  let problemSolvingScore = 74;

  if (wordCount > 35) {
    technicalScore += 8;
    communicationScore += 6;
  }
  if (wordCount > 70) {
    technicalScore += 6;
    communicationScore += 8;
  }
  if (matchedKeywords >= 2) {
    technicalScore += 8;
    problemSolvingScore += 8;
  }
  if (matchedKeywords >= 4) {
    technicalScore += 8;
    problemSolvingScore += 8;
  }
  if (wordCount < 18) {
    technicalScore = 60;
    communicationScore = 64;
    problemSolvingScore = 62;
  }

  technicalScore = Math.min(technicalScore, 98);
  communicationScore = Math.min(communicationScore, 96);
  problemSolvingScore = Math.min(problemSolvingScore, 98);
  const compositeScore = Math.round((technicalScore * 0.4) + (communicationScore * 0.3) + (problemSolvingScore * 0.3));

  let feedback = "";
  if (wordCount < 18) {
    feedback = "Your answer was quite brief. In technical interviews, articulate the underlying mechanism, architecture, and provide a concrete example.";
  } else if (matchedKeywords >= 3) {
    feedback = "Excellent response! You highlighted essential architectural terminology and demonstrated clear technical depth and structured problem-solving.";
  } else {
    feedback = "Good conceptual explanation! To achieve top-tier marks, weave in specific production metrics, edge cases, and architectural trade-offs.";
  }

  return {
    score: compositeScore,
    technicalScore,
    communicationScore,
    problemSolvingScore,
    feedback,
    matchedKeywordsCount: matchedKeywords,
    isFinished,
    nextQuestion: !isFinished ? bank[nextIndex].question : null,
    nextQuestionType: !isFinished ? bank[nextIndex].type : null,
    nextRoundTitle: !isFinished ? bank[nextIndex].round : null,
    nextQuestionIndex: nextIndex
  };
};

export const finalizeInterview = (role = "Full Stack Developer", sessionData = {}) => {
  return {
    role,
    overallScore: 86,
    breakdown: {
      technicalKnowledge: 88,
      communication: 82,
      problemSolving: 89,
      answerQuality: 85
    },
    strengths: [
      "Structured articulation with clear terminology",
      "Sound comprehension of architectural trade-offs",
      "Good algorithmic and design thinking mindset",
      "Confident response formulation"
    ],
    improvementAreas: [
      "Cite quantifiable production metrics in real-world scenarios",
      "Deepen edge-case handling and fault tolerance concepts",
      "Structure behavioral responses strictly using STAR (Situation, Task, Action, Result)"
    ],
    verdict: "Placement Ready for High-Growth Product & Enterprise Roles"
  };
};
