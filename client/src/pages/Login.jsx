import { Link } from "react-router-dom";
import "../App.css";

function Login() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span>🎓</span>
          <h2>
            Viva<span>Mate</span> AI
          </h2>
        </div>

        <div className="auth-heading">
          <h1>Welcome Back 👋</h1>
          <p>Log in to continue your preparation journey.</p>
        </div>

        <form className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <div className="password-label">
              <label htmlFor="password">Password</label>
              <a href="#forgot-password">Forgot Password?</a>
            </div>

            <input
              type="password"
              id="password"
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="auth-submit">
            Log In <span>→</span>
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/signup">Create an account</Link>
        </p>

        <Link to="/" className="back-home">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Login;