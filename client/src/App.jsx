import { useEffect, useState } from "react";
import "./App.css";

/* =========================================================
   APP CONSTANTS
========================================================= */

const STORAGE_KEY = "vivamate_users";
const SESSION_KEY = "vivamate_current_user";

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

function getStoredUsers() {
  try {
    const users = localStorage.getItem(STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error("Unable to read stored users:", error);
    return [];
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Unable to save users:", error);
  }
}

function getPasswordStrength(password) {
  if (!password) {
    return {
      level: "",
      label: "",
    };
  }

  if (password.length < 6) {
    return {
      level: "weak",
      label: "Weak password",
    };
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const score = [
    password.length >= 8,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecial,
  ].filter(Boolean).length;

  if (score >= 4) {
    return {
      level: "strong",
      label: "Strong password",
    };
  }

  return {
    level: "medium",
    label: "Medium password",
  };
}

/* =========================================================
   LOGO COMPONENT
========================================================= */

function Logo({ onClick }) {
  return (
    <button
      type="button"
      className="auth-logo logo-button"
      onClick={onClick}
      aria-label="Go to VivaMate AI home"
    >
      <span className="logo-icon" aria-hidden="true">
        🎓
      </span>

      <h2>
        Viva<span>Mate</span> AI
      </h2>
    </button>
  );
}

/* =========================================================
   NAVBAR COMPONENT
========================================================= */

function Navbar({ currentPage, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigation = (page) => {
    onNavigate(page);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <button
          type="button"
          className="brand"
          onClick={() => handleNavigation("home")}
          aria-label="VivaMate AI home"
        >
          <span className="brand-icon" aria-hidden="true">
            🎓
          </span>

          <span>
            Viva<span className="brand-highlight">Mate</span> AI
          </span>
        </button>

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setMenuOpen((previous) => !previous)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <div className={`nav-content ${menuOpen ? "nav-content-open" : ""}`}>
          <div className="nav-links">
            <button
              type="button"
              className={currentPage === "home" ? "active" : ""}
              onClick={() => handleNavigation("home")}
            >
              Home
            </button>

            <button
              type="button"
              className={currentPage === "features" ? "active" : ""}
              onClick={() => handleNavigation("features")}
            >
              Features
            </button>

            <button
              type="button"
              className={currentPage === "about" ? "active" : ""}
              onClick={() => handleNavigation("about")}
            >
              About
            </button>
          </div>

          <div className="nav-buttons">
            <button
              type="button"
              className="nav-login-btn"
              onClick={() => handleNavigation("login")}
            >
              Log In
            </button>

            <button
              type="button"
              className="nav-signup-btn"
              onClick={() => handleNavigation("signup")}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

/* =========================================================
   HOME PAGE
========================================================= */

function HomePage({ onNavigate }) {
  return (
    <div className="site-page">
      <Navbar currentPage="home" onNavigate={onNavigate} />

      <main className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span>✦</span>
            Your smarter academic companion
          </div>

          <h1>
            Learn smarter.
            <br />
            <span>Achieve more.</span>
          </h1>

          <p>
            VivaMate AI helps students prepare for exams, organize their
            learning, and build confidence with intelligent academic tools.
          </p>

          <div className="hero-buttons">
            <button
              type="button"
              className="primary-btn"
              onClick={() => onNavigate("signup")}
            >
              Start Learning
              <span>→</span>
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={() => onNavigate("features")}
            >
              Explore Features
            </button>
          </div>

          <div className="hero-trust">
            <span>✓</span>
            Built for students
            <span>✓</span>
            Simple and organized
          </div>
        </div>

        <div className="hero-visual" aria-label="VivaMate AI dashboard preview">
          <div className="dashboard-card">
            <div className="dashboard-top">
              <div>
                <span className="small-label">WELCOME BACK</span>
                <h3>Your learning dashboard</h3>
              </div>

              <div className="dashboard-avatar">FM</div>
            </div>

            <div className="progress-card">
              <div className="progress-icon">📚</div>

              <div className="progress-info">
                <span>Weekly Progress</span>
                <strong>78%</strong>
              </div>

              <div className="progress-track">
                <div className="progress-fill" />
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="mini-card">
                <span>📝</span>
                <strong>12</strong>
                <small>Tasks completed</small>
              </div>

              <div className="mini-card">
                <span>🎯</span>
                <strong>86%</strong>
                <small>Quiz average</small>
              </div>

              <div className="mini-card">
                <span>🔥</span>
                <strong>7 days</strong>
                <small>Learning streak</small>
              </div>

              <div className="mini-card">
                <span>⏱️</span>
                <strong>4.5h</strong>
                <small>This week's study</small>
              </div>
            </div>

            <div className="dashboard-bottom">
              <span>Today's focus</span>
              <strong>Data Structures & Algorithms</strong>
              <span className="status-dot">● In progress</span>
            </div>
          </div>
        </div>
      </main>

      <section className="home-features">
        <div className="section-heading">
          <span className="section-eyebrow">WHY VIVAMATE</span>
          <h2>Everything you need to learn with confidence.</h2>
          <p>
            Organize your academic journey with simple, focused, and powerful
            tools.
          </p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon purple">🧠</div>
            <h3>Smart Learning</h3>
            <p>
              Understand difficult concepts through structured learning
              support.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon blue">📊</div>
            <h3>Track Progress</h3>
            <p>
              Monitor your study progress and keep your academic goals visible.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon green">🎯</div>
            <h3>Exam Preparation</h3>
            <p>
              Practice consistently and prepare for exams with confidence.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   FEATURES PAGE
========================================================= */

function FeaturesPage({ onNavigate }) {
  const features = [
    {
      icon: "🧠",
      title: "AI Study Assistant",
      description:
        "Get help understanding academic concepts and learning difficult topics.",
    },
    {
      icon: "📚",
      title: "Study Resources",
      description:
        "Keep your notes, learning material, and important resources organized.",
    },
    {
      icon: "📝",
      title: "Quiz Practice",
      description:
        "Test your knowledge with practice questions and revision activities.",
    },
    {
      icon: "📈",
      title: "Progress Tracking",
      description:
        "Track your academic progress and identify areas that need attention.",
    },
    {
      icon: "🗓️",
      title: "Study Planning",
      description:
        "Create a clear study routine and manage your academic workload.",
    },
    {
      icon: "🎯",
      title: "Goal Management",
      description:
        "Set meaningful academic goals and stay focused on your progress.",
    },
  ];

  return (
    <div className="site-page">
      <Navbar currentPage="features" onNavigate={onNavigate} />

      <main className="content-page">
        <div className="content-header">
          <span className="section-eyebrow">POWERFUL FEATURES</span>
          <h1>Tools designed for your academic journey.</h1>
          <p>
            VivaMate AI brings your learning experience into one organized
            space.
          </p>
        </div>

        <div className="full-feature-grid">
          {features.map((feature) => (
            <div className="large-feature-card" key={feature.title}>
              <div className="large-feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <button
                type="button"
                className="text-link"
                onClick={() => onNavigate("signup")}
              >
                Get started →
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   ABOUT PAGE
========================================================= */

function AboutPage({ onNavigate }) {
  return (
    <div className="site-page">
      <Navbar currentPage="about" onNavigate={onNavigate} />

      <main className="content-page about-page">
        <div className="content-header">
          <span className="section-eyebrow">ABOUT VIVAMATE AI</span>
          <h1>Built to make student life more organized.</h1>
          <p>
            VivaMate AI is a student-focused platform designed to support
            learning, planning, and academic growth.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-card">
            <div className="about-icon">🎓</div>
            <h2>Our Mission</h2>
            <p>
              To make academic learning more accessible, organized, and
              engaging for students.
            </p>
          </div>

          <div className="about-card">
            <div className="about-icon">✨</div>
            <h2>Our Vision</h2>
            <p>
              To create a helpful digital companion that supports students
              throughout their educational journey.
            </p>
          </div>
        </div>

        <div className="about-cta">
          <h2>Ready to begin your learning journey?</h2>
          <button
            type="button"
            className="primary-btn"
            onClick={() => onNavigate("signup")}
          >
            Create Your Account →
          </button>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   PASSWORD INPUT COMPONENT
========================================================= */

function PasswordInput({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  showPassword,
  onToggle,
  required = true,
  autoComplete,
}) {
  return (
    <div className="form-group">
      <div className="password-label">
        <label htmlFor={id}>{label}</label>

        <button
          type="button"
          className="inline-link-button"
          onClick={onToggle}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      <div className="password-input-wrapper">
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          minLength={6}
        />

        <button
          type="button"
          className="password-toggle"
          onClick={onToggle}
          aria-label={showPassword ? "Hide password" : "Show password"}
          title={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   AUTH LAYOUT
========================================================= */

function AuthLayout({ children, onNavigate, cardClassName = "" }) {
  return (
    <main className="auth-page">
      <div className={`auth-card ${cardClassName}`}>
        <Logo onClick={() => onNavigate("home")} />
        {children}
      </div>
    </main>
  );
}

/* =========================================================
   LOGIN PAGE
========================================================= */

function LoginPage({ onNavigate, onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage(null);

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields.",
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage({
        type: "error",
        text: "Please enter a valid email address.",
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const users = getStoredUsers();
      const user = users.find(
        (storedUser) =>
          storedUser.email.toLowerCase() === email &&
          storedUser.password === password
      );

      if (!user) {
        setMessage({
          type: "error",
          text: "Invalid email or password. Please check your details or create an account.",
        });
        setIsLoading(false);
        return;
      }

      if (rememberMe) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      } else {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
      }

      setIsLoading(false);
      onLogin(user);
    }, 700);
  };

  const handleForgotPassword = () => {
    if (!formData.email.trim()) {
      setMessage({
        type: "error",
        text: "Enter your email address first to reset your password.",
      });
      return;
    }

    setMessage({
      type: "success",
      text: "Password reset instructions would be sent to your email in a real application.",
    });
  };

  return (
    <AuthLayout onNavigate={onNavigate}>
      <div className="auth-heading">
        <h1>Welcome back</h1>
        <p>Log in to continue your learning journey.</p>
      </div>

      {message && (
        <div
          className={`auth-message ${message.type}`}
          role={message.type === "error" ? "alert" : "status"}
        >
          {message.text}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="login-email">Email address</label>

          <input
            id="login-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        <PasswordInput
          id="login-password"
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          showPassword={showPassword}
          onToggle={() => setShowPassword((previous) => !previous)}
          autoComplete="current-password"
        />

        <div className="form-options">
          <label className="remember-option">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            <span>Remember me</span>
          </label>

          <button
            type="button"
            className="forgot-link forgot-button"
            onClick={handleForgotPassword}
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="auth-submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="button-spinner" />
              Logging in...
            </>
          ) : (
            <>
              Log In
              <span>→</span>
            </>
          )}
        </button>
      </form>

      <div className="auth-divider">
        <span>OR</span>
      </div>

      <p className="auth-switch">
        Don't have an account?{" "}
        <button
          type="button"
          className="inline-link-button"
          onClick={() => onNavigate("signup")}
        >
          Create an account
        </button>
      </p>

      <button
        type="button"
        className="back-home back-home-button"
        onClick={() => onNavigate("home")}
      >
        ← Back to home
      </button>
    </AuthLayout>
  );
}

/* =========================================================
   SIGNUP PAGE
========================================================= */

function SignupPage({ onNavigate, onLogin }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const passwordStrength = getPasswordStrength(formData.password);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage(null);

    const fullName = formData.fullName.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!fullName || !email || !password || !confirmPassword) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields.",
      });
      return;
    }

    if (fullName.length < 2) {
      setMessage({
        type: "error",
        text: "Please enter your full name.",
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage({
        type: "error",
        text: "Please enter a valid email address.",
      });
      return;
    }

    if (password.length < 6) {
      setMessage({
        type: "error",
        text: "Password must contain at least 6 characters.",
      });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({
        type: "error",
        text: "Passwords do not match.",
      });
      return;
    }

    if (!acceptTerms) {
      setMessage({
        type: "error",
        text: "Please accept the terms and conditions to continue.",
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const users = getStoredUsers();

      const alreadyExists = users.some(
        (user) => user.email.toLowerCase() === email
      );

      if (alreadyExists) {
        setMessage({
          type: "error",
          text: "An account with this email already exists. Please log in.",
        });
        setIsLoading(false);
        return;
      }

      const newUser = {
        id: Date.now(),
        fullName,
        email,
        password,
      };

      saveUsers([...users, newUser]);

      setIsLoading(false);
      onLogin(newUser);
    }, 700);
  };

  return (
    <AuthLayout onNavigate={onNavigate} cardClassName="signup-card">
      <div className="auth-heading">
        <h1>Create your account</h1>
        <p>Start building a smarter and more organized learning journey.</p>
      </div>

      {message && (
        <div
          className={`auth-message ${message.type}`}
          role={message.type === "error" ? "alert" : "status"}
        >
          {message.text}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="signup-fullName">Full name</label>

          <input
            id="signup-fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Muhammad Farman"
            autoComplete="name"
            required
            minLength={2}
          />
        </div>

        <div className="form-group">
          <label htmlFor="signup-email">Email address</label>

          <input
            id="signup-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        <PasswordInput
          id="signup-password"
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
          showPassword={showPassword}
          onToggle={() => setShowPassword((previous) => !previous)}
          autoComplete="new-password"
        />

        {formData.password && (
          <div className={`password-strength ${passwordStrength.level}`}>
            <div className="strength-header">
              <span>Password strength</span>
              <strong>{passwordStrength.label}</strong>
            </div>

            <div className="strength-bar">
              <div />
            </div>

            <small>
              Use 8+ characters with uppercase, numbers, and symbols for a
              stronger password.
            </small>
          </div>
        )}

        <PasswordInput
          id="signup-confirmPassword"
          name="confirmPassword"
          label="Confirm password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter your password"
          showPassword={showConfirmPassword}
          onToggle={() =>
            setShowConfirmPassword((previous) => !previous)
          }
          autoComplete="new-password"
        />

        {formData.confirmPassword && (
          <div
            className={`password-match ${
              formData.password === formData.confirmPassword
                ? "match"
                : "no-match"
            }`}
          >
            {formData.password === formData.confirmPassword
              ? "✓ Passwords match"
              : "✕ Passwords do not match"}
          </div>
        )}

        <label className="terms-option">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(event) => setAcceptTerms(event.target.checked)}
          />

          <span>
            I agree to the{" "}
            <button
              type="button"
              className="inline-link-button"
              onClick={() =>
                setMessage({
                  type: "success",
                  text: "Terms and conditions will be available when the full platform is launched.",
                })
              }
            >
              Terms and Conditions
            </button>{" "}
            and Privacy Policy.
          </span>
        </label>

        <button
          type="submit"
          className="auth-submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="button-spinner" />
              Creating account...
            </>
          ) : (
            <>
              Create Account
              <span>→</span>
            </>
          )}
        </button>
      </form>

      <div className="auth-divider">
        <span>OR</span>
      </div>

      <p className="auth-switch">
        Already have an account?{" "}
        <button
          type="button"
          className="inline-link-button"
          onClick={() => onNavigate("login")}
        >
          Log in
        </button>
      </p>

      <button
        type="button"
        className="back-home back-home-button"
        onClick={() => onNavigate("home")}
      >
        ← Back to home
      </button>
    </AuthLayout>
  );
}

/* =========================================================
   DASHBOARD PAGE
========================================================= */

function DashboardPage({ user, onLogout }) {
  return (
    <div className="dashboard-page">
      <header className="dashboard-navbar">
        <div className="dashboard-brand">
          <span>🎓</span>
          Viva<span>Mate</span> AI
        </div>

        <button
          type="button"
          className="dashboard-logout"
          onClick={onLogout}
        >
          Log Out
        </button>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-welcome">
          <div>
            <span className="section-eyebrow">STUDENT DASHBOARD</span>
            <h1>
              Welcome, {user?.fullName?.split(" ")[0] || "Student"}! 👋
            </h1>
            <p>Continue your learning journey and make progress today.</p>
          </div>

          <div className="dashboard-user-card">
            <div className="user-avatar">
              {(user?.fullName || "S").charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{user?.fullName || "Student"}</strong>
              <span>{user?.email || "student@example.com"}</span>
            </div>
          </div>
        </div>

        <div className="dashboard-stat-grid">
          <div className="dashboard-stat-card">
            <span className="stat-card-icon purple">📚</span>
            <span>Courses</span>
            <strong>06</strong>
            <small>Active courses</small>
          </div>

          <div className="dashboard-stat-card">
            <span className="stat-card-icon blue">📝</span>
            <span>Tasks</span>
            <strong>24</strong>
            <small>Completed this month</small>
          </div>

          <div className="dashboard-stat-card">
            <span className="stat-card-icon green">🎯</span>
            <span>Average Score</span>
            <strong>86%</strong>
            <small>Across your quizzes</small>
          </div>

          <div className="dashboard-stat-card">
            <span className="stat-card-icon orange">🔥</span>
            <span>Study Streak</span>
            <strong>07</strong>
            <small>Days in a row</small>
          </div>
        </div>

        <div className="dashboard-content-grid">
          <div className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <span className="section-eyebrow">YOUR PROGRESS</span>
                <h2>Learning overview</h2>
              </div>

              <span className="panel-badge">This week</span>
            </div>

            <div className="overview-progress">
              <div className="overview-progress-top">
                <span>Weekly learning goal</span>
                <strong>78%</strong>
              </div>

              <div className="overview-track">
                <div className="overview-fill" />
              </div>

              <p>You're making great progress. Keep going!</p>
            </div>

            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-icon">✓</span>
                <div>
                  <strong>Completed DSA revision</strong>
                  <small>Today, 10:30 AM</small>
                </div>
                <span className="activity-status">Done</span>
              </div>

              <div className="activity-item">
                <span className="activity-icon">✓</span>
                <div>
                  <strong>Finished Python quiz</strong>
                  <small>Yesterday, 4:15 PM</small>
                </div>
                <span className="activity-status">Done</span>
              </div>

              <div className="activity-item">
                <span className="activity-icon pending">◷</span>
                <div>
                  <strong>Review Operating Systems</strong>
                  <small>Upcoming task</small>
                </div>
                <span className="activity-status pending-text">Pending</span>
              </div>
            </div>
          </div>

          <div className="dashboard-panel focus-panel">
            <span className="section-eyebrow">TODAY'S FOCUS</span>
            <div className="focus-illustration">🎯</div>
            <h2>Stay consistent</h2>
            <p>
              Small progress every day creates meaningful academic results.
            </p>

            <button type="button" className="primary-btn dashboard-action">
              Start a Study Session →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   NOT FOUND PAGE
========================================================= */

function NotFoundPage({ onNavigate }) {
  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-icon">🔍</div>
        <span className="section-eyebrow">ERROR 404</span>
        <h1>Page not found</h1>
        <p>
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <button
          type="button"
          className="primary-btn"
          onClick={() => onNavigate("home")}
        >
          ← Back to Home
        </button>
      </div>
    </main>
  );
}

/* =========================================================
   MAIN APP COMPONENT
========================================================= */

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const savedUser =
        localStorage.getItem(SESSION_KEY) ||
        sessionStorage.getItem(SESSION_KEY);

      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Unable to restore session:", error);
    }
  }, []);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
    setCurrentPage("home");
  };

  if (currentPage === "dashboard" && currentUser) {
    return <DashboardPage user={currentUser} onLogout={handleLogout} />;
  }

  if (currentPage === "login") {
    return (
      <LoginPage
        onNavigate={handleNavigate}
        onLogin={handleLogin}
      />
    );
  }

  if (currentPage === "signup") {
    return (
      <SignupPage
        onNavigate={handleNavigate}
        onLogin={handleLogin}
      />
    );
  }

  if (currentPage === "features") {
    return <FeaturesPage onNavigate={handleNavigate} />;
  }

  if (currentPage === "about") {
    return <AboutPage onNavigate={handleNavigate} />;
  }

  if (currentPage === "home") {
    return <HomePage onNavigate={handleNavigate} />;
  }

  return <NotFoundPage onNavigate={handleNavigate} />;
}

export default App;