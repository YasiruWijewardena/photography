// pages/login.js

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import '../styles/public/home.css';

export default function Login() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      // Redirect based on user role
      if (session.user.role === 'customer') {
        router.push('/');
      } else if (session.user.role === 'photographer') {
        router.push('/'); // Adjust as needed
      } else {
        router.push('/');
      }
    }
  }, [status, session, router]);

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error
    const res = await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password,
      loginType: 'public', // Specify loginType as 'public' if needed
    });

    if (res?.error) {
      setError('Invalid email or password');
    }
    // No need to manually fetch session; useSession will handle it
  };

  return (
    <div className="login">
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-input-container">
          <input
            type="email"
            name="email"
            placeholder="example@email.com"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="login-input-container">
          <input
            type="password"
            name="password"
            placeholder="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {/* Submit */}
        <button type="submit" className="login-submit">
          Login
        </button>
      </form>
      <p>
        Don't have an account?{' '}
        <a href="/signup">
          Sign Up
        </a>
      </p>
    </div>
  );
}
