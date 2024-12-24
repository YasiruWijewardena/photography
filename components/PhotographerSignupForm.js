// components/PhotographerSignupForm.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function PhotographerSignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    bio: '',
    website: '',
    instagram: '',
    mobile_num: '',
    address: '',
    profile_picture: null, // For profile picture upload
    subscription_id: '',
  });
  const [subscriptions, setSubscriptions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch available subscriptions
    fetch('/api/subscriptions')
      .then((res) => res.json())
      .then((data) => setSubscriptions(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile_picture') {
      setFormData({
        ...formData,
        [name]: files[0], // Store the file object
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
    // Use FormData to handle file uploads
    const data = new FormData();
    data.append('firstname', formData.firstname);
    data.append('lastname', formData.lastname);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('bio', formData.bio);
    data.append('website', formData.website);
    data.append('instagram', formData.instagram);
    data.append('mobile_num', formData.mobile_num);
    data.append('address', formData.address);
    data.append('subscription_id', formData.subscription_id);
    // Required file uploads
    if (formData.profile_picture) {
      data.append('profile_picture', formData.profile_picture);
    }

    try {
      const res = await fetch('/api/auth/signup/photographer', {
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

      {/* First Name */}
      <div className='signup-input-container'>
        <label htmlFor="firstname">First Name:</label>
        <input
          type="text"
          id="firstname"
          name="firstname"
          required
          value={formData.firstname}
          onChange={handleChange}
        />
      </div>

      {/* Last Name */}
      <div className='signup-input-container'>
        <label htmlFor="lastname">Last Name:</label>
        <input
          type="text"
          id="lastname"
          name="lastname"
          required
          value={formData.lastname}
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

      {/* Bio */}
      <div className='signup-input-container'>
        <label htmlFor="bio">Bio:</label>
        <textarea
          id="bio"
          name="bio"
          required
          value={formData.bio}
          onChange={handleChange}
        ></textarea>
      </div>

      {/* Website */}
      <div className='signup-input-container'>
        <label htmlFor="website">Website:</label>
        <input
          type="url"
          id="website"
          name="website"
          value={formData.website}
          onChange={handleChange}
        />
      </div>

      {/* Instagram */}
      <div className='signup-input-container'>
        <label htmlFor="instagram">Instagram:</label>
        <input
          type="text"
          id="instagram"
          name="instagram"
          value={formData.instagram}
          onChange={handleChange}
        />
      </div>

      {/* Mobile Number */}
      <div className='signup-input-container'>
        <label htmlFor="mobile_num">Mobile Number:</label>
        <input
          type="tel"
          id="mobile_num"
          name="mobile_num"
          required
          value={formData.mobile_num}
          onChange={handleChange}
        />
      </div>

      {/* Address */}
      <div className='signup-input-container'>
        <label htmlFor="address">Address:</label>
        <input
          type="text"
          id="address"
          name="address"
          required
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      {/* Profile Picture */}
      <div className='signup-input-container'>
        <label htmlFor="profile_picture">Profile Picture:</label>
        <input
          type="file"
          id="profile_picture"
          name="profile_picture"
          accept="image/*"
          required
          onChange={handleChange}
        />
      </div>

      {/* Subscription */}
      <div className='signup-input-container'>
        <label htmlFor="subscription_id">Subscription:</label>
        <select
          id="subscription_id"
          name="subscription_id"
          required
          value={formData.subscription_id}
          onChange={handleChange}
        >
          <option value="">Select Subscription</option>
          {subscriptions.map((subscription) => (
            <option key={subscription.id} value={subscription.id}>
              {subscription.name} - ${subscription.price}
            </option>
          ))}
        </select>
      </div>

      {/* Submit */}
      <button type="submit" className='signup-submit'>Sign Up</button>
    </form>
  );
}
