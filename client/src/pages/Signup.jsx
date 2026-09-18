import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { api } from "../api";
import { isUserLoggedIn } from "../utils/session";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isUserLoggedIn()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.signup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("vivaMateToken", response.token);
      localStorage.setItem("vivaMateUserName", response.user.name);
      localStorage.setItem("vivaMateUserEmail", response.user.email);

      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Signup failed. Please try again.");
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

        <div className="auth-card signup-card">
          <div className="auth-heading">
            <span className="auth-eyebrow">GET STARTED</span>
            <h1>Create your account</h1>
            <p>
              Start organizing your academic life today.
            </p>
          </div>

          {error && <div className="form-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Full name
              <div className="input-wrapper">
                <span>♙</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Muhammad Farman"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </label>

            <label>
              Email address
              <div className="input-wrapper">
                <span>✉</span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </label>

            <label>
              Password
              <div className="input-wrapper">
                <span>▣</span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
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

            <label>
              Confirm password
              <div className="input-wrapper">
                <span>▣</span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </label>

            <label className="terms-option">
              <input type="checkbox" required />
              <span>
                I agree to the terms and privacy policy.
              </span>
            </label>

            <button type="submit" className="auth-submit-button" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create Account"}
              <span>→</span>
            </button>
          </form>

          <p className="auth-bottom-text">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>
        </div>

        <p className="auth-footer-text">
          Secure learning workspace • VivaMate AI
        </p>
      </div>
    </div>
  );
}

export default Signup;