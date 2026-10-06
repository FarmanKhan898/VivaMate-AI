import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { api } from "../api";
import { isUserLoggedIn } from "../utils/session";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isUserLoggedIn()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.login({ email: email.trim(), password });

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("vivaMateToken", response.token);
      localStorage.setItem("vivaMateUserEmail", response.user.email);
      localStorage.setItem("vivaMateUserName", response.user.name || response.user.email.split("@")[0]);

      const destination = location.state?.from || "/dashboard";
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-decoration auth-decoration-one" />
      <div className="auth-decoration auth-decoration-two" />

      <div className="auth-container">
        <div className="auth-brand">
          <Link to="/" className="brand-link">
            <div className="brand-symbol">V</div>
            <div className="brand-details">
              <strong>
                Viva<span>Mate</span>
              </strong>
              <small>AI Learning Companion</small>
            </div>
          </Link>
        </div>

        <div className="auth-card">
          <div className="auth-heading">
            <span className="auth-eyebrow">WELCOME BACK</span>
            <h1>Sign in to your account</h1>
            <p>
              Continue your learning journey with VivaMate AI.
            </p>
          </div>

          {error && <div className="form-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Email address
              <div className="input-wrapper">
                <span>✉</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </label>

            <label>
              Password
              <div className="input-wrapper">
                <span>▣</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <div className="auth-form-options">
              <button
                type="button"
                className="forgot-button"
                onClick={() =>
                  setNotice("Password recovery is not configured yet. Contact your VivaMate administrator to reset your password.")
                }
              >
                Forgot password?
              </button>
            </div>

            {notice && <div className="form-error" role="status">{notice}</div>}

            <button type="submit" className="auth-submit-button" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign In"}
              <span>→</span>
            </button>
          </form>

          <p className="auth-bottom-text">
            Don&apos;t have an account?{" "}
            <Link to="/signup">Create an account</Link>
          </p>
        </div>

        <p className="auth-footer-text">
          Secure learning workspace • VivaMate AI
        </p>
      </div>
    </div>
  );
}

export default Login;
