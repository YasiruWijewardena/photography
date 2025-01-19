// pages/admin/signup.js

import { useState } from 'react';
import { useRouter } from 'next/router';
import '../../styles/global.css';

export default function AdminSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('/api/admin/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstname, lastname, username, email, password }),
      });

      if (res.ok) {
        router.push('/admin/login');
      } else {
        const data = await res.json();
        setError(data.error || 'An unexpected error occurred');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-header">SIGN UP</h1>
      <form onSubmit={handleSignup} className="admin-form">
      <div className="admin-input-container">
      <input
          type="text"
          placeholder="firstname"
          required
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />
      </div>
      <div className="admin-input-container">
      <input
          type="text"
          placeholder="lastname"
          required
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />
      </div>
      <div className="admin-input-container">
      <input
          type="text"
          placeholder="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="admin-input-container">
      <input type="email" placeholder="admin@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="admin-input-container">
      <input
            type="password"
            placeholder="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
      </div>
        
        
          

          
        <button type="submit" className='admin-primary-btn'>Signup</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

