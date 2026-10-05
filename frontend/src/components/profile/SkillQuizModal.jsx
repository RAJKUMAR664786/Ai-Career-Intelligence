import React, { useState, useEffect } from "react";
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Clock, 
  Check, 
  AlertCircle,
  HelpCircle
} from "lucide-react";
import confetti from "canvas-confetti";
import api from "../../services/api";

const SkillQuizModal = ({ isOpen, onClose, skillName, onSkillUpdated }) => {
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [showExplanations, setShowExplanations] = useState(false);

  useEffect(() => {
    if (isOpen && skillName) {
      setLoading(true);
      setIsSubmitted(false);
      setSelectedAnswers({});
      setCurrentQIndex(0);
      setTimeLeft(300);
      setShowExplanations(false);

      api.getSkillQuiz(skillName)
        .then((res) => {
          if (res.data && res.data.data) {
            setQuizData(res.data.data);
          }
        })
        .catch((err) => console.error("Error loading quiz", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, skillName]);

  // Real-time ticking timer
  useEffect(() => {
    if (!isOpen || isSubmitted || loading || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, isSubmitted, loading, timeLeft]);

  if (!isOpen) return null;

  const questions = quizData?.questions || [];
  const currentQ = questions[currentQIndex];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSelectOption = (questionId, optionIndex) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    if (!quizData || !quizData.questions) return;
    let correctCount = 0;
    quizData.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const calculatedPercentage = Math.round((correctCount / quizData.questions.length) * 100);
    setScore(calculatedPercentage);
    setIsSubmitted(true);

    if (calculatedPercentage >= 70) {
      try {
        confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
      } catch (e) {}
    }

    if (onSkillUpdated) {
      onSkillUpdated(skillName, calculatedPercentage);
    }
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(15, 23, 42, 0.7)", zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
          {/* Header */}
          <div className="modal-header border-0 bg-light px-4 py-3 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <Award className="text-primary" size={22} />
              <h5 className="modal-title fw-bold text-dark mb-0">
                Separated Technical Test: <span className="text-primary">{skillName}</span>
              </h5>
            </div>
            
            <div className="d-flex align-items-center gap-3">
              {!isSubmitted && !loading && (
                <div 
                  className={`badge px-3 py-2 rounded-pill d-flex align-items-center gap-1.5 fw-bold ${
                    timeLeft < 60 ? "bg-danger text-white animate-pulse" : "bg-white text-dark border shadow-sm"
                  }`}
                  style={{ fontSize: "0.85rem" }}
                >
                  <Clock size={15} className={timeLeft < 60 ? "text-white" : "text-primary"} />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              )}
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
          </div>

          {/* Body */}
          <div className="modal-body p-4">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <div className="mt-2 text-secondary">Loading {skillName} assessment questions...</div>
              </div>
            ) : isSubmitted ? (
              /* Results Screen */
              <div className="text-center py-2">
                <div 
                  className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{ 
                    width: "80px", 
                    height: "80px", 
                    backgroundColor: score >= 70 ? "#ecfdf5" : "#fffbeb",
                    color: score >= 70 ? "#059669" : "#d97706"
                  }}
                >
                  <Award size={40} />
                </div>
                <h3 className="fw-bold text-dark mb-1">Assessment Completed!</h3>
                <p className="text-secondary mb-3">
                  You scored <strong className="text-primary fs-3">{score}%</strong> ({answeredCount}/{questions.length} answered)
                </p>

                <div className="p-3 bg-light rounded-4 d-inline-block text-start mb-4 border w-100" style={{ maxWidth: "600px" }}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="fw-bold text-dark">
                      {score >= 70 ? "✅ Verified Skill Badge Awarded" : "⚠️ Room for Improvement"}
                    </span>
                    <span className={`badge ${score >= 70 ? "bg-success" : "bg-warning text-dark"} rounded-pill`}>
                      {score >= 70 ? "VERIFIED" : "UNVERIFIED"}
                    </span>
                  </div>
                  <p className="text-muted small mb-3">
                    {score >= 70 
                      ? `Congratulations! Your real-time skill score for ${skillName} has been upgraded to ${score}% and synced across your Profile, Skill Gap Analyzer, and Career Fit score.`
                      : `You scored ${score}%. A passing grade of 70% is required to earn the verified badge. Review the explanations below and retake the test.`}
                  </p>

                  <button 
                    onClick={() => setShowExplanations(!showExplanations)} 
                    className="btn btn-sm btn-outline-secondary w-100 rounded-3 mb-2"
                  >
                    {showExplanations ? "Hide Detailed Answer Key" : "View Questions & Answer Key with Explanations"}
                  </button>

                  {showExplanations && (
                    <div className="d-flex flex-column gap-3 mt-3 pt-3 border-top" style={{ maxHeight: "300px", overflowY: "auto" }}>
                      {questions.map((q, idx) => {
                        const userAns = selectedAnswers[q.id];
                        const isCorrect = userAns === q.correctIndex;
                        return (
                          <div key={q.id} className="p-3 rounded-3 border bg-white text-start">
                            <div className="d-flex align-items-center justify-content-between mb-1">
                              <span className="fw-bold text-dark small">Q{idx + 1}: {q.question}</span>
                              {isCorrect ? (
                                <span className="badge bg-success-subtle text-success d-flex align-items-center gap-1">
                                  <Check size={12} /> Correct
                                </span>
                              ) : (
                                <span className="badge bg-danger-subtle text-danger d-flex align-items-center gap-1">
                                  <AlertCircle size={12} /> Incorrect
                                </span>
                              )}
                            </div>
                            <div className="small text-muted mb-1">
                              Your answer: <strong>{userAns !== undefined ? q.options[userAns] : "Not answered"}</strong>
                            </div>
                            <div className="small text-success mb-1">
                              Correct answer: <strong>{q.options[q.correctIndex]}</strong>
                            </div>
                            <div className="small text-secondary bg-light p-2 rounded-2 mt-1">
                              💡 <em>{q.explanation}</em>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-center gap-3">
                  <button 
                    className="btn btn-outline-secondary px-4 py-2 rounded-3 d-flex align-items-center gap-2"
                    onClick={() => {
                      setIsSubmitted(false);
                      setSelectedAnswers({});
                      setCurrentQIndex(0);
                      setTimeLeft(300);
                      setShowExplanations(false);
                    }}
                  >
                    <RotateCcw size={16} /> Retake Test
                  </button>
                  <button className="btn btn-primary px-4 py-2 rounded-3" onClick={onClose}>
                    Apply Real-Time Score & Close
                  </button>
                </div>
              </div>
            ) : currentQ ? (
              /* Active Test Taking Screen */
              <div>
                {/* Question Palette / Navigator */}
                <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                  <div className="d-flex align-items-center gap-1.5 flex-wrap">
                    {questions.map((q, idx) => {
                      const isAnswered = selectedAnswers[q.id] !== undefined;
                      const isCurrent = idx === currentQIndex;
                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrentQIndex(idx)}
                          className={`btn btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center ${
                            isCurrent 
                              ? "btn-primary text-white shadow-sm" 
                              : isAnswered 
                              ? "btn-success text-white" 
                              : "btn-light text-secondary border"
                          }`}
                          style={{ width: "32px", height: "32px", fontSize: "0.8rem", fontWeight: "bold" }}
                          title={`Jump to Question ${idx + 1}`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-muted small fw-semibold">
                    {answeredCount} of {questions.length} Answered
                  </span>
                </div>

                <div className="mb-4">
                  <div className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 mb-2 fw-semibold" style={{ fontSize: "0.75rem" }}>
                    Question {currentQIndex + 1} of {questions.length}
                  </div>
                  <h5 className="fw-bold text-dark" style={{ lineHeight: "1.5" }}>
                    {currentQ.question}
                  </h5>
                </div>

                {/* Multiple choice options */}
                <div className="d-flex flex-column gap-2.5 mb-4">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedAnswers[currentQ.id] === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(currentQ.id, idx)}
                        className={`btn text-start p-3 rounded-3 border d-flex align-items-center justify-content-between ${
                          isSelected ? "border-primary bg-primary-subtle text-primary fw-semibold" : "bg-white text-dark"
                        }`}
                        style={{ transition: "all 0.15s ease" }}
                      >
                        <div className="d-flex align-items-center gap-3">
                          <span 
                            className="badge rounded-circle d-flex align-items-center justify-content-center"
                            style={{ 
                              width: "28px", 
                              height: "28px", 
                              backgroundColor: isSelected ? "#2563eb" : "#f1f5f9",
                              color: isSelected ? "#ffffff" : "#475569" 
                            }}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span style={{ fontSize: "0.95rem" }}>{opt}</span>
                        </div>
                        {isSelected && <CheckCircle size={18} className="text-primary" />}
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Navigation */}
                <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                  <button
                    className="btn btn-light px-3 py-2 rounded-3"
                    disabled={currentQIndex === 0}
                    onClick={() => setCurrentQIndex((prev) => prev - 1)}
                  >
                    Previous
                  </button>

                  <div className="d-flex gap-2">
                    {currentQIndex < questions.length - 1 ? (
                      <button
                        className="btn btn-primary px-4 py-2 rounded-3 d-flex align-items-center gap-2"
                        onClick={() => setCurrentQIndex((prev) => prev + 1)}
                      >
                        Next <ArrowRight size={16} />
                      </button>
                    ) : (
                      <button
                        className="btn btn-success px-4 py-2 rounded-3 d-flex align-items-center gap-2 fw-semibold"
                        onClick={handleSubmitQuiz}
                      >
                        Finish & Calculate Score <Award size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">No questions available for this skill.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillQuizModal;
