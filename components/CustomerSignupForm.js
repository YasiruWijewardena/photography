import { useState } from 'react';
import { useRouter } from 'next/router';

export default function CustomerSignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    profile_image: null, // For file input
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile_image') {
      setFormData({
        ...formData,
        profile_image: files[0], // Store the file object
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Use FormData to handle file upload
    const data = new FormData();
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('password', formData.password);
    if (formData.profile_image) {
      data.append('profile_image', formData.profile_image);
    }

    try {
      const res = await fetch('/api/auth/signup/customer', {
        method: 'POST',
        body: data, // FormData handles headers
      });
      if (res.ok) {
        router.push('/login');
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Error signing up');
      }
    } catch (err) {
      console.error(err);
      setError('Error signing up');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='signup-form'>
      {error && <p className="error">{error}</p>}

      {/* Username */}
      <div className='signup-input-container'>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          required
          value={formData.username}
          onChange={handleChange}
        />
      </div>

      {/* Email */}
      <div className='signup-input-container'>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      {/* Password */}
      <div className='signup-input-container'>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      {/* Profile Image (Optional) */}
      <div className='signup-input-container'>
        <label htmlFor="profile_image">Profile Image (Optional):</label>
        <input
          type="file"
          id="profile_image"
          name="profile_image"
          accept="image/*"
          onChange={handleChange}
        />
      </div>

      {/* Submit */}
      <button type="submit" className='signup-submit'>Sign Up</button>
    </form>
  );
}
