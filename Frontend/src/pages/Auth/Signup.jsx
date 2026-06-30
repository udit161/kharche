import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, ArrowRight, UserPlus } from 'lucide-react';
import './Auth.css';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token);
        // Optionally save user data if needed
        navigate('/');
      } else {
        setError(data.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
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
        <h1>Create Account</h1>
        <p>Join Kharche and track wisely</p>
      </div>

      {error && <div className="auth-error animate-in">{error}</div>}

      <form className="auth-form" onSubmit={handleSignup}>
        <div className="auth-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            className="auth-input"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
        </div>

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

        <button type="submit" className="btn-primary auth-button" disabled={loading}>
          {loading ? 'Creating account...' : (
            <>
              Sign Up <UserPlus size={18} />
            </>
          )}
        </button>
      </form>

      <div className="auth-footer">
        Already have an account? <Link to="/login">Log in <ArrowRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /></Link>
      </div>
    </div>
  );
}
