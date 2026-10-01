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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isUserLoggedIn()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const saveSession = (token, userEmail, userName) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("vivaMateToken", token);
    localStorage.setItem("vivaMateUserEmail", userEmail);
    localStorage.setItem("vivaMateUserName", userName);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    // 1. Try backend
    try {
      const response = await api.login({ email: email.trim(), password });
      saveSession(
        response.token,
        response.user.email,
        response.user.name || response.user.email.split("@")[0]
      );
      navigate(location.state?.from || "/dashboard", { replace: true });
      return;
    } catch (backendError) {
      const isNetworkError =
        backendError.message === "Failed to fetch" ||
        backendError.message.includes("NetworkError") ||
        backendError.message.includes("fetch");

      // Backend returned a real auth error (wrong password / not found) — show it
      if (!isNetworkError) {
        setError(backendError.message || "Incorrect email or password.");
        setIsSubmitting(false);
        return;
      }
      // Backend unreachable — fall through to local fallback
    }

    // 2. Local fallback — check accounts saved by offline signup
    try {
      const localAccounts = JSON.parse(
        localStorage.getItem("vivaMateLocalAccounts") || "[]"
      );
      const match = localAccounts.find(
        (acc) => acc.email === email.trim().toLowerCase()
      );

      if (!match || match.password !== password) {
        setError(
          "The backend is offline and no matching local account was found. " +
          "Please start the backend server or sign up again."
        );
        setIsSubmitting(false);
        return;
      }

      const fakeToken = btoa(
        JSON.stringify({ id: match.id, email: match.email, name: match.name })
      );
      saveSession(fakeToken, match.email, match.name);
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch {
      setError("Login failed. Please try again.");
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

          {error && (
            <div className="form-error" role="alert">
              <p>{error}</p>
              <span>
                New to VivaMate? <Link to="/signup">Create an account</Link>
              </span>
            </div>
          )}

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
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((previous) => !previous)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <div className="auth-form-options">
              <label className="remember-option">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="forgot-button"
                onClick={() =>
                  window.alert(
                    "Password recovery will be available when backend authentication is connected."
                  )
                }
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="auth-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
              <span>→</span>
            </button>
          </form>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <button
            className="social-login-button"
            onClick={() =>
              window.alert(
                "Social login will be connected in the backend version."
              )
            }
          >
            <span>G</span>
            Continue with Google
          </button>

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
