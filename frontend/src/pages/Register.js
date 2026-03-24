import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill in all fields.');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters.');
    if (form.password !== form.confirm) return toast.error('Passwords do not match.');

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created. Welcome to TaskMaster.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-header">
          <h1>TaskMaster</h1>
          <p>Create your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Full Name</label>
            <input
              className="input"
              type="text"
              name="name"
              placeholder="Your full name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
            />
          </div>
          <div className="form-group">
            <label className="label">Email Address</label>
            <input
              className="input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="label">Confirm Password</label>
            <input
              className="input"
              type="password"
              name="confirm"
              placeholder="Re-enter your password"
              value={form.confirm}
              onChange={handleChange}
            />
          </div>

          <button className="btn btn-primary auth-btn" type="submit" disabled={loading}>
            {loading ? <><span className="btn-spinner" /> Creating account...</> : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
