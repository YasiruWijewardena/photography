
// pages/login.js

import { useState, useEffect  } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import '../styles/public/home.css';

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (res.error) {
      setError(res.error);
    } 
  };

  // Handle Google sign-in
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/login' });
  };

  // Handle redirection after sign-in via any provider
  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading

    if (status === 'authenticated') {
      if (session.user.role === 'customer' || session.user.role === 'photographer') {
        router.push('/'); 
      } else if (session.user.role === 'pending') {
        router.push('/signup'); 
      } else {
        router.push('/'); 
      }
    }
  }, [session, status, router]);

  return (
    <div className="login">
      <h1>Login</h1>

      <button onClick={handleGoogleSignIn} className="google-button">
        <img src="/google-logo.png" alt="Google Logo" className="google-logo" />
        Sign in with Google
      </button>

      {/* Traditional Sign-In Form */}
      <form onSubmit={handleSubmit} className="login-form">
        {/* Google Sign-In Button */}
      

      {/* Divider */}
      <div className="divider">
        <span>OR</span>
      </div>
        {error && <p className="error-message">{error}</p>}

        {/* Email */}
        <div className="login-input-container">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="login-input-container">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Sign-In Button */}
        <button type="submit" className="login-submit">Login</button>
      </form>
      <p>
        Don't have an account?{' '}
        <a href="/signup" className="signup-link">
          Sign Up
        </a>
      </p>
    </div>
  );
}