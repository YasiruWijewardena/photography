// pages/admin/index.js

import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import '../../styles/global.css';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // Added state for error messages

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session && session.user.role === 'admin') {
        // If admin is already logged in, redirect to dashboard
        router.push('/admin/dashboard');
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Reset error message
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      loginType: 'admin', // Include loginType as 'admin'
      callbackUrl: '/admin/dashboard',
    });

    if (res?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      router.push(res.url || '/admin/dashboard');
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-header">LOGIN</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-input-container">
          <input
            type="email"
            id="email"
            placeholder="admin@example.com"
            className=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="admin-input-container">
          <input
            type="password"
            id="password"
            placeholder="password"
            className=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className={`admin-primary-btn ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>
        Don't have an account?{' '}
        <a href="/admin/signup" className="admin-link">
          Sign Up
        </a>
      </p>
    </div>
  );
}
