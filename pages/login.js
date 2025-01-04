// // pages/login.js

// import { useState, useEffect } from 'react';
// import { signIn, useSession } from 'next-auth/react';
// import { useRouter } from 'next/router';
// import '../styles/public/home.css';

// export default function Login() {
//   const router = useRouter();
//   const { data: session, status } = useSession();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (status === 'authenticated') {
//       // Redirect based on user role
//       if (session.user.role === 'customer') {
//         router.push('/');
//       } else if (session.user.role === 'photographer') {
//         router.push('/'); // Adjust as needed
//       } else {
//         router.push('/');
//       }
//     }
//   }, [status, session, router]);

//   const handleChange = (e) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(''); // Reset error
//     const res = await signIn('credentials', {
//       redirect: false,
//       email: formData.email,
//       password: formData.password,
//       loginType: 'public', // Specify loginType as 'public' if needed
//     });

//     if (res?.error) {
//       setError('Invalid email or password');
//     }
//     // No need to manually fetch session; useSession will handle it
//   };

//   return (
//     <div className="login">
//       <h1>Login</h1>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <form onSubmit={handleSubmit} className="login-form">
//         <div className="login-input-container">
//           <input
//             type="email"
//             name="email"
//             placeholder="example@email.com"
//             required
//             value={formData.email}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="login-input-container">
//           <input
//             type="password"
//             name="password"
//             placeholder="password"
//             required
//             value={formData.password}
//             onChange={handleChange}
//           />
//         </div>

//         {/* Submit */}
//         <button type="submit" className="login-submit">
//           Login
//         </button>
//       </form>
//       <p>
//         Don't have an account?{' '}
//         <a href="/signup">
//           Sign Up
//         </a>
//       </p>
//     </div>
//   );
// }
// pages/login.js

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import '../styles/public/home.css';

export default function Login() {
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
    } else {
      router.push('/'); // Redirect to a dashboard or home page
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: 'http://localhost:3000' });
  };

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
    </div>
  );
}