import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wallet, ArrowRight, LogIn } from "lucide-react";
import GoogleAuthButton from "../../components/GoogleAuthButton";
import "./Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        // Optionally save user data if needed
        // localStorage.setItem('user', JSON.stringify(data));
        navigate("/");
      } else {
        setError(
          data.message || "Login failed. Please check your credentials.",
        );
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card auth-container animate-in">
      <div className="auth-header">
        <div className="auth-logo">
          <Wallet size={32} />
        </div>
        <h1>Welcome Back</h1>
        <p>Log in to manage your Kharche</p>
      </div>

      {error && <div className="auth-error animate-in">{error}</div>}

      <form className="auth-form" onSubmit={handleLogin}>
        <div className="auth-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            className="auth-input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="auth-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="auth-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn-primary auth-button"
          disabled={loading}
        >
          {loading ? (
            "Logging in..."
          ) : (
            <>
              Login <LogIn size={18} />
            </>
          )}
        </button>
      </form>

      <div className="auth-divider">
        <span>or</span>
      </div>
      <GoogleAuthButton />

      <div className="auth-footer">
        Don't have an account?{" "}
        <Link to="/signup">
          Sign up{" "}
          <ArrowRight
            size={14}
            style={{ display: "inline", verticalAlign: "middle" }}
          />
        </Link>
      </div>
    </div>
  );
}
