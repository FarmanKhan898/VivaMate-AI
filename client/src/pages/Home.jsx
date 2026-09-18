import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: "▦",
      title: "Smart Dashboard",
      description:
        "View your academic progress, tasks, courses, and study activity in one place.",
    },
    {
      icon: "✦",
      title: "AI Learning Assistant",
      description:
        "Get study guidance, explanations, summaries, and learning suggestions.",
    },
    {
      icon: "✓",
      title: "Task Management",
      description:
        "Organize assignments, deadlines, and daily academic responsibilities.",
    },
    {
      icon: "◈",
      title: "Progress Tracking",
      description:
        "Track your course completion, quiz performance, and learning consistency.",
    },
  ];

  return (
    <div className="landing-page">
      <header className="landing-navbar">
        <div className="landing-brand">
          <div className="landing-brand-icon">V</div>
          <strong>
            Viva<span>Mate</span> AI
          </strong>
        </div>

        <nav className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#about">About</a>
        </nav>

        <div className="landing-nav-actions">
          <button
            className="landing-login-button"
            onClick={() => navigate("/login")}
          >
            Log in
          </button>

          <button
            className="landing-signup-button"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </button>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span>✦</span>
            Your intelligent academic companion
          </div>

          <h1>
            Study smarter.
            <br />
            <span>Achieve more.</span>
          </h1>

          <p>
            VivaMate AI brings your courses, tasks, quizzes, progress,
            and intelligent learning assistance together in one
            beautiful workspace.
          </p>

          <div className="hero-actions">
            <button
              className="primary-button large-button"
              onClick={() => navigate("/signup")}
            >
              Start Learning Free
              <span>→</span>
            </button>

            <button
              className="secondary-button large-button"
              onClick={() => navigate("/login")}
            >
              Explore Dashboard
            </button>
          </div>

          <div className="hero-trust">
            <div className="trust-avatars">
              <span>MF</span>
              <span>AK</span>
              <span>SA</span>
              <span>+</span>
            </div>

            <div>
              <strong>Built for ambitious students</strong>
              <p>Organize your entire learning journey.</p>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-glow" />

          <div className="hero-dashboard-card">
            <div className="mini-dashboard-header">
              <div>
                <span>VivaMate AI</span>
                <strong>Good morning, Farman 👋</strong>
              </div>
              <div className="mini-avatar">MF</div>
            </div>

            <div className="mini-stat-grid">
              <div className="mini-stat-card">
                <span>Study Hours</span>
                <strong>24.5h</strong>
                <small>↑ 12.5%</small>
              </div>

              <div className="mini-stat-card">
                <span>Tasks Done</span>
                <strong>18</strong>
                <small>↑ 8.2%</small>
              </div>
            </div>

            <div className="mini-progress-card">
              <div className="mini-card-title">
                <strong>Weekly Progress</strong>
                <span>68%</span>
              </div>

              <div className="mini-progress-bar">
                <span />
              </div>

              <div className="mini-week">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>

            <div className="mini-task-card">
              <div className="mini-card-title">
                <strong>Upcoming Tasks</strong>
                <span>View all</span>
              </div>

              <div className="mini-task-row">
                <span className="mini-check">✓</span>
                <div>
                  <strong>Data Structures Assignment</strong>
                  <small>Due tomorrow</small>
                </div>
                <span className="mini-tag">High</span>
              </div>

              <div className="mini-task-row">
                <span className="mini-check pending">◷</span>
                <div>
                  <strong>Operating Systems Quiz</strong>
                  <small>Due Friday</small>
                </div>
                <span className="mini-tag normal">Medium</span>
              </div>
            </div>
          </div>

          <div className="floating-ai-card">
            <div className="floating-ai-icon">✦</div>
            <div>
              <strong>AI Study Tip</strong>
              <p>Review your notes for 20 minutes.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section" id="features">
        <div className="section-heading">
          <span className="section-eyebrow">POWERFUL FEATURES</span>
          <h2>Everything you need to learn better</h2>
          <p>
            Designed to help students stay organized, focused, and
            consistent.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => (
            <div className="feature-card" key={feature.title}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <span className="feature-arrow">→</span>
            </div>
          ))}
        </div>
      </section>

      <section className="workflow-section" id="how-it-works">
        <div className="workflow-content">
          <span className="section-eyebrow">SIMPLE WORKFLOW</span>
          <h2>Your academic life, organized.</h2>
          <p>
            Stop switching between different tools. VivaMate AI gives
            you a central space to manage your study life.
          </p>

          <div className="workflow-steps">
            <div>
              <span>01</span>
              <div>
                <strong>Create your workspace</strong>
                <p>Set up your student profile and preferences.</p>
              </div>
            </div>

            <div>
              <span>02</span>
              <div>
                <strong>Organize your studies</strong>
                <p>Add courses, tasks, quizzes, and study goals.</p>
              </div>
            </div>

            <div>
              <span>03</span>
              <div>
                <strong>Improve with AI</strong>
                <p>Use intelligent guidance to study more effectively.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="workflow-art">
          <div className="workflow-art-circle">
            <span>✦</span>
          </div>
          <div className="workflow-art-card card-one">
            <span>✓</span>
            <div>
              <strong>Tasks organized</strong>
              <small>Everything under control</small>
            </div>
          </div>
          <div className="workflow-art-card card-two">
            <span>✦</span>
            <div>
              <strong>AI support</strong>
              <small>Learn with confidence</small>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-cta" id="about">
        <div>
          <span className="section-eyebrow">START YOUR JOURNEY</span>
          <h2>Make every study session count.</h2>
          <p>
            Build better academic habits with VivaMate AI.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => navigate("/signup")}
        >
          Create Free Account →
        </button>
      </section>

      <footer className="landing-footer">
        <div className="landing-brand">
          <div className="landing-brand-icon">V</div>
          <strong>
            Viva<span>Mate</span> AI
          </strong>
        </div>

        <p>© 2026 VivaMate AI. Built for smarter learning.</p>
      </footer>
    </div>
  );
}

export default Home;