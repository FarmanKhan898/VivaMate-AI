import { useEffect, useMemo, useState } from "react";

import { evaluateAnswer } from "../utils/vivaData";

function Quizzes() {
  const [generatedSets, setGeneratedSets] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("vivaMateGeneratedSets") || "[]");
    } catch {
      return [];
    }
  });

  const [selectedSetId, setSelectedSetId] = useState(() => {
    try {
      const latest = localStorage.getItem("vivaMateLatestSet");
      return latest ? JSON.parse(latest).id : null;
    } catch {
      return null;
    }
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [submittedAnswers, setSubmittedAnswers] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    try {
      const savedSets = JSON.parse(localStorage.getItem("vivaMateGeneratedSets") || "[]");
      setGeneratedSets(savedSets);

      const latest = localStorage.getItem("vivaMateLatestSet");
      if (latest) {
        setSelectedSetId(JSON.parse(latest).id);
      }
    } catch {
      // Ignore storage parsing errors.
    }
  }, []);

  const selectedSet = useMemo(
    () => generatedSets.find((set) => set.id === selectedSetId) || generatedSets[0] || null,
    [generatedSets, selectedSetId]
  );

  const computeScore = (answersList = submittedAnswers) => {
    if (!selectedSet) return 0;

    const score = answersList.reduce((total, entry) => {
      const question = selectedSet.questions[entry.questionIndex];
      if (!question) return total;

      return total + evaluateAnswer(question, entry.answer).score;
    }, 0);

    return Math.round(score / Math.max(answersList.length, 1));
  };

  const saveHistory = (score) => {
    const history = JSON.parse(localStorage.getItem("vivaMateHistory") || "[]");
    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      subject: selectedSet?.subject || "General Topic",
      score,
      activityType: "Mock Viva",
    };

    localStorage.setItem("vivaMateHistory", JSON.stringify([entry, ...history].slice(0, 8)));
  };

  const startQuiz = (set = selectedSet) => {
    if (!set) {
      window.alert("Create an AI-generated study set first from the Subjects page.");
      return;
    }

    setCurrentQuestion(0);
    setSelectedAnswer("");
    setSubmittedAnswers([]);
    setQuizFinished(false);
    setQuizStarted(true);
    setSelectedSetId(set.id);
  };

  const nextQuestion = () => {
    if (!selectedAnswer.trim()) {
      window.alert("Please select or type an answer first.");
      return;
    }

    const nextAnswers = [...submittedAnswers, { questionIndex: currentQuestion, answer: selectedAnswer }];
    const isLastQuestion = currentQuestion === (selectedSet?.questions?.length || 1) - 1;

    if (isLastQuestion) {
      const score = computeScore(nextAnswers);
      saveHistory(score);
      setSubmittedAnswers(nextAnswers);
      setQuizFinished(true);
      return;
    }

    setSubmittedAnswers(nextAnswers);
    setCurrentQuestion((previous) => previous + 1);
    setSelectedAnswer("");
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setSubmittedAnswers([]);
    setQuizFinished(false);
    setQuizStarted(false);
  };

  if (quizStarted && selectedSet) {
    const question = selectedSet.questions[currentQuestion];

    if (quizFinished) {
      const score = computeScore(submittedAnswers);

      return (
        <div className="inner-page">
          <section className="quiz-result-card">
            <div className="result-icon">✦</div>
            <span className="page-eyebrow">QUIZ COMPLETED</span>
            <h2>Great work!</h2>
            <p>You completed the {selectedSet.subject} viva practice set.</p>

            <div className="result-score">
              <strong>{score}%</strong>
              <span>{submittedAnswers.length} answers reviewed</span>
            </div>

            <div className="result-actions">
              <button className="primary-button" onClick={() => startQuiz(selectedSet)}>
                Try Again
              </button>

              <button className="secondary-button" onClick={resetQuiz}>
                Back to Quizzes
              </button>
            </div>
          </section>
        </div>
      );
    }

    return (
      <div className="inner-page">
        <section className="quiz-header">
          <div>
            <span className="page-eyebrow">ACTIVE MOCK VIVA</span>
            <h2>{selectedSet.subject}</h2>
          </div>

          <button className="secondary-button" onClick={resetQuiz}>Exit Quiz</button>
        </section>

        <section className="quiz-question-card">
          <div className="quiz-progress-header">
            <span>
              Question {currentQuestion + 1} of {selectedSet.questions.length}
            </span>
            <strong>
              {Math.round(((currentQuestion + 1) / selectedSet.questions.length) * 100)}%
            </strong>
          </div>

          <div className="quiz-progress-bar">
            <span style={{ width: `${((currentQuestion + 1) / selectedSet.questions.length) * 100}%` }} />
          </div>

          <h3>{question.question}</h3>

          <div className="answer-field-block">
            <label>
              Your answer
              <textarea
                value={selectedAnswer}
                onChange={(event) => setSelectedAnswer(event.target.value)}
                rows={6}
                placeholder="Provide a strong viva answer in 2–4 sentences."
              />
            </label>
          </div>

          <div className="quiz-option-list">
            {question.mcq.map((option) => (
              <button
                key={option}
                type="button"
                className={`quiz-option ${selectedAnswer === option ? "selected" : ""}`}
                onClick={() => setSelectedAnswer(option)}
              >
                <span className="option-letter">{String.fromCharCode(65 + question.mcq.indexOf(option))}</span>
                {option}
              </button>
            ))}
          </div>

          <div className="quiz-question-footer">
            <span>Use the model answer as guidance and include your own reasoning.</span>
            <button className="primary-button" onClick={nextQuestion}>
              {currentQuestion === selectedSet.questions.length - 1 ? "Finish Viva" : "Next Question"}
              <span>→</span>
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="inner-page">
      <section className="page-intro-row">
        <div>
          <span className="page-eyebrow">PRACTICE CENTER</span>
          <h2>Mock viva and quiz practice</h2>
          <p>Generate AI-backed viva questions and train for interviews and oral exams.</p>
        </div>
      </section>

      <section className="quiz-feature-card">
        <div className="quiz-feature-content">
          <span className="quiz-feature-badge">AI POWERED</span>
          <h3>{selectedSet ? selectedSet.subject : "No practice set yet"}</h3>
          <p>
            {selectedSet
              ? `Practice ${selectedSet.questions.length} viva questions for ${selectedSet.topic}.`
              : "Create a subject and generate questions from the Subjects page to begin."}
          </p>

          <div className="quiz-feature-meta">
            <span>✎ {selectedSet ? selectedSet.questions.length : 0} Questions</span>
            <span>◷ {selectedSet ? selectedSet.difficulty : "Ready"}</span>
            <span>✦ {selectedSet ? selectedSet.language : "English"}</span>
          </div>

          <button className="primary-button" onClick={() => startQuiz(selectedSet)} disabled={!selectedSet}>
            {selectedSet ? "Start Mock Viva" : "Generate Practice Set"}
          </button>
        </div>

        <div className="quiz-feature-art">
          <div className="quiz-art-circle">✦</div>
          <span>✓</span>
          <span>✧</span>
          <span>◈</span>
        </div>
      </section>

      <section className="quiz-section-heading">
        <span className="page-eyebrow">AVAILABLE SETS</span>
        <h3>Recent practice material</h3>
      </section>

      <section className="quiz-cards-grid">
        {generatedSets.length === 0 ? (
          <div className="empty-state wide-empty">
            <div>✦</div>
            <h3>No generated sets yet</h3>
            <p>Go to the Subjects page and create your first viva set.</p>
          </div>
        ) : (
          generatedSets.slice(0, 3).map((set) => (
            <div className="practice-quiz-card" key={set.id}>
              <div className="practice-quiz-icon purple">{set.subject.slice(0, 2).toUpperCase()}</div>
              <h3>{set.subject}</h3>
              <p>{set.topic}</p>

              <div className="practice-quiz-bottom">
                <span>{set.questions.length} questions</span>
                <button onClick={() => startQuiz(set)}>Open</button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default Quizzes;