import React, { useState, useEffect } from "react";
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  Award, 
  ArrowRight, 
  Sparkles,
  RefreshCw,
  TrendingUp,
  Clock,
  Printer,
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import confetti from "canvas-confetti";
import api from "../../services/api";
import { useStudent } from "../../context/StudentContext";

const InterviewChat = ({ 
  role = "Full Stack Developer", 
  difficulty = "Intermediate", 
  interviewType = "Technical + HR", 
  onBack 
}) => {
  const { addInterviewRecord } = useStudent();

  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionType, setQuestionType] = useState("Technical");
  const [roundTitle, setRoundTitle] = useState("Round 1: Core Fundamentals");
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [userAnswer, setUserAnswer] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalScorecard, setFinalScorecard] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);

  // Real-time per-question countdown timer (90 seconds)
  const [timeLeft, setTimeLeft] = useState(90);

  useEffect(() => {
    const initInterview = async () => {
      setLoading(true);
      try {
        const res = await api.startInterview(role, difficulty, interviewType);
        if (res.data && res.data.data) {
          const data = res.data.data;
          setSessionData(data);
          setCurrentQuestion(data.question);
          setQuestionType(data.questionType || "Technical");
          setRoundTitle(data.roundTitle || "Round 1: Core Fundamentals");
          setTotalQuestions(data.totalQuestions || 5);
          setCurrentQIndex(0);
          setTimeLeft(90);
          setChatHistory([
            {
              sender: "ai",
              text: `Welcome to your Real-Time AI Mock Interview for ${role} (${difficulty} level). We will conduct ${data.totalQuestions || 5} progressive rounds. Take your time to articulate clearly.`
            },
            {
              sender: "ai",
              text: data.question,
              type: data.questionType || "Technical",
              round: data.roundTitle || "Round 1: Core Fundamentals"
            }
          ]);
        }
      } catch (err) {
        console.error("Failed to start interview", err);
      } finally {
        setLoading(false);
      }
    };
    initInterview();
  }, [role, difficulty, interviewType]);

  // Real-time ticking timer per question
  useEffect(() => {
    if (loading || evaluating || isCompleted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, evaluating, isCompleted, currentQIndex, timeLeft]);

  // Voice speech synthesis (Text-to-Speech)
  const speakText = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Voice recognition (Speech-to-Text)
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your answer.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  // Submit Answer in Real Time
  const handleSubmitAnswer = async (e) => {
    e?.preventDefault();
    if (!userAnswer.trim() || evaluating) return;

    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);

    const answerToSubmit = userAnswer.trim();
    setUserAnswer("");
    setEvaluating(true);

    const updatedHistory = [...chatHistory, { sender: "user", text: answerToSubmit }];
    setChatHistory(updatedHistory);

    try {
      const res = await api.evaluateInterviewAnswer(role, currentQuestion, answerToSubmit, updatedHistory);
      if (res.data && res.data.data) {
        const evalData = res.data.data;

        if (evalData.isFinished || currentQIndex + 1 >= totalQuestions) {
          // Finalize interview
          const finalRes = await api.finalizeInterview(role, { history: updatedHistory });
          if (finalRes.data && finalRes.data.data) {
            const report = finalRes.data.data;
            setFinalScorecard(report);
            setIsCompleted(true);

            // Real-time cascade to student context history!
            addInterviewRecord({
              role,
              score: report.overallScore,
              breakdown: report.breakdown,
              verdict: report.verdict
            });

            try {
              confetti({ particleCount: 110, spread: 85, origin: { y: 0.5 } });
            } catch (e) {}
          }
        } else {
          // Next question advance
          const nextIndex = currentQIndex + 1;
          setCurrentQIndex(nextIndex);
          setCurrentQuestion(evalData.nextQuestion);
          setQuestionType(evalData.nextQuestionType || "Technical");
          setRoundTitle(evalData.nextRoundTitle || `Round ${nextIndex + 1}`);
          setTimeLeft(90);

          setChatHistory((prev) => [
            ...prev,
            {
              sender: "ai",
              feedback: evalData.feedback,
              score: evalData.score,
              technicalScore: evalData.technicalScore,
              communicationScore: evalData.communicationScore,
              text: evalData.nextQuestion,
              type: evalData.nextQuestionType || "Technical",
              round: evalData.nextRoundTitle || `Round ${nextIndex + 1}`
            }
          ]);

          if (autoSpeak) {
            speakText(evalData.nextQuestion);
          }
        }
      }
    } catch (err) {
      console.error("Evaluation error", err);
    } finally {
      setEvaluating(false);
    }
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (loading) {
    return (
      <div className="custom-card text-center py-5">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <h5 className="fw-bold text-dark">Initializing Multi-Round AI Mock Interview</h5>
        <p className="text-secondary small">Gemini is curating real-time technical questions for {role}...</p>
      </div>
    );
  }

  return (
    <div className="custom-card p-0 overflow-hidden shadow-sm">
      {/* Top Header Bar */}
      <div className="p-3 bg-light border-bottom d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div className="d-flex align-items-center gap-3">
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "44px", height: "44px", backgroundColor: "#2563eb", color: "#ffffff" }}
          >
            <Bot size={24} />
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <span className="fw-bold text-dark fs-6">{role} Interview</span>
              <span className="badge bg-primary-subtle text-primary rounded-pill px-2.5 py-0.5 small fw-semibold">
                {difficulty}
              </span>
              <span className="badge bg-light text-secondary border rounded-pill px-2.5 py-0.5 small">
                {interviewType}
              </span>
            </div>
            <div className="text-muted small">
              Round {Math.min(currentQIndex + 1, totalQuestions)} of {totalQuestions} • <strong className="text-primary">{roundTitle}</strong>
            </div>
          </div>
        </div>

        {/* Real-Time Live Clock & Actions */}
        <div className="d-flex align-items-center gap-3">
          {!isCompleted && (
            <div 
              className={`badge px-3 py-2 rounded-pill d-flex align-items-center gap-1.5 fw-bold ${
                timeLeft < 25 ? "bg-danger text-white animate-pulse" : "bg-white text-dark border shadow-sm"
              }`}
              style={{ fontSize: "0.85rem" }}
            >
              <Clock size={15} className={timeLeft < 25 ? "text-white" : "text-primary"} />
              <span>{formatTimer(timeLeft)}</span>
            </div>
          )}

          {onBack && (
            <button onClick={onBack} className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1.5">
              Exit Interview
            </button>
          )}
        </div>
      </div>

      {/* Progress Line */}
      {!isCompleted && (
        <div className="progress rounded-0" style={{ height: "4px" }}>
          <div 
            className="progress-bar bg-primary" 
            style={{ width: `${((currentQIndex + 1) / totalQuestions) * 100}%`, transition: "width 0.4s ease" }}
          />
        </div>
      )}

      {/* Screen 1: Final Evaluation Scorecard */}
      {isCompleted && finalScorecard ? (
        <div className="p-4 p-md-5 text-center">
          <div 
            className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3"
            style={{ width: "90px", height: "90px", backgroundColor: "#ecfdf5", color: "#059669" }}
          >
            <Award size={48} />
          </div>
          <h3 className="fw-bold text-dark mb-1">Interview Completed!</h3>
          <p className="text-secondary mb-4">
            Real-Time AI Performance Assessment Report for <strong>{role}</strong> ({difficulty}).
          </p>

          <div className="row g-3 justify-content-center mb-4">
            <div className="col-6 col-md-3">
              <div className="p-3 rounded-4 bg-light border text-center shadow-sm">
                <div className="text-secondary small fw-semibold">Technical Knowledge</div>
                <div className="fs-3 fw-bold text-primary mt-1">{finalScorecard.breakdown?.technicalKnowledge}%</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 rounded-4 bg-light border text-center shadow-sm">
                <div className="text-secondary small fw-semibold">Communication</div>
                <div className="fs-3 fw-bold text-success mt-1">{finalScorecard.breakdown?.communication}%</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 rounded-4 bg-light border text-center shadow-sm">
                <div className="text-secondary small fw-semibold">Problem Solving</div>
                <div className="fs-3 fw-bold text-info mt-1">{finalScorecard.breakdown?.problemSolving}%</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 rounded-4 bg-light border text-center shadow-sm">
                <div className="text-secondary small fw-semibold">Answer Quality</div>
                <div className="fs-3 fw-bold text-warning mt-1">{finalScorecard.breakdown?.answerQuality}%</div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-4 bg-primary-subtle text-primary border border-primary-subtle d-inline-block px-4 mb-4 fw-bold fs-5">
            Overall Placement Readiness: {finalScorecard.overallScore}% • {finalScorecard.verdict}
          </div>

          <div className="row g-4 text-start mb-4">
            <div className="col-md-6">
              <div className="p-3.5 rounded-4 border bg-light h-100">
                <h6 className="fw-bold text-success d-flex align-items-center gap-2 mb-3">
                  <CheckCircle size={18} /> Candidate Strengths
                </h6>
                <ul className="mb-0 ps-3">
                  {finalScorecard.strengths?.map((str, idx) => (
                    <li key={idx} className="mb-2 text-dark small">{str}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-3.5 rounded-4 border bg-light h-100">
                <h6 className="fw-bold text-warning d-flex align-items-center gap-2 mb-3">
                  <TrendingUp size={18} /> Key Actionable Improvement Areas
                </h6>
                <ul className="mb-0 ps-3">
                  {finalScorecard.improvementAreas?.map((area, idx) => (
                    <li key={idx} className="mb-2 text-dark small">{area}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3">
            <button onClick={onBack} className="btn btn-outline-secondary px-4 py-2 rounded-3">
              Back to Dashboard
            </button>
            <button 
              onClick={() => window.print()} 
              className="btn btn-light border px-4 py-2 rounded-3 d-flex align-items-center gap-2"
            >
              <Printer size={16} /> Print Scorecard
            </button>
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-primary px-4 py-2 rounded-3 d-flex align-items-center gap-2"
            >
              <RefreshCw size={16} /> Start Another Mock Interview
            </button>
          </div>
        </div>
      ) : (
        /* Screen 2: Active Real-Time Turn-by-Turn Conversational Screen */
        <div className="p-4">
          <div className="d-flex flex-column gap-3 mb-4" style={{ maxHeight: "440px", overflowY: "auto" }}>
            {chatHistory.map((msg, idx) => {
              const isAi = msg.sender === "ai";
              return (
                <div key={idx} className={`d-flex ${isAi ? "justify-content-start" : "justify-content-end"}`}>
                  <div 
                    className={`p-3.5 rounded-4 shadow-sm ${
                      isAi ? "bg-white border text-dark" : "bg-primary text-white"
                    }`}
                    style={{ maxWidth: "85%" }}
                  >
                    {isAi && msg.round && (
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-0.5 rounded-pill small fw-semibold">
                          {msg.round}
                        </span>
                        <button 
                          onClick={() => speakText(msg.text)} 
                          className="btn btn-sm btn-link text-secondary p-0 ms-2"
                          title="Read Question Aloud"
                        >
                          <Volume2 size={16} className={isSpeaking ? "text-primary" : ""} />
                        </button>
                      </div>
                    )}

                    {/* Instant Feedback on previous answer */}
                    {msg.feedback && (
                      <div className="mb-2.5 p-3 rounded-3 bg-light border-start border-3 border-success text-dark small">
                        <div className="d-flex align-items-center justify-content-between mb-1">
                          <span className="fw-bold text-success">
                            AI Evaluation Score: {msg.score}/100
                          </span>
                          {msg.technicalScore && (
                            <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                              Tech: {msg.technicalScore}% • Comm: {msg.communicationScore}%
                            </span>
                          )}
                        </div>
                        <div>{msg.feedback}</div>
                      </div>
                    )}

                    <div style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>{msg.text}</div>
                  </div>
                </div>
              );
            })}

            {evaluating && (
              <div className="d-flex justify-content-start">
                <div className="p-3 rounded-4 bg-light border text-secondary small d-flex align-items-center gap-2">
                  <Sparkles size={16} className="text-primary spin-animation" />
                  Gemini is evaluating your answer and generating the next progressive round question...
                </div>
              </div>
            )}
          </div>

          {/* User Input & Audio Controls */}
          <form onSubmit={handleSubmitAnswer} className="position-relative">
            <div className="input-group bg-white rounded-4 border shadow-sm p-1.5">
              <textarea
                rows={2}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here or click the microphone to speak your response in real-time..."
                className="form-control border-0 bg-transparent px-3 py-2"
                style={{ resize: "none", fontSize: "0.9rem" }}
                disabled={evaluating}
              />
              <div className="d-flex align-items-center gap-1.5 pe-2">
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`btn btn-sm rounded-circle p-2 ${
                    isListening ? "btn-danger animate-pulse" : "btn-light text-secondary"
                  }`}
                  title={isListening ? "Listening... click to finish speaking" : "Speak answer with microphone"}
                  disabled={evaluating}
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <button
                  type="submit"
                  disabled={!userAnswer.trim() || evaluating}
                  className="btn btn-primary rounded-circle p-2"
                  title="Submit answer and get live AI score"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>

            {/* Listening Waveform Indicator */}
            {isListening && (
              <div className="mt-2 text-danger small fw-semibold d-flex align-items-center gap-2">
                <span className="spinner-grow spinner-grow-sm text-danger" role="status"></span>
                <span>Microphone active: Speaking in real-time... Click mic when finished.</span>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default InterviewChat;
