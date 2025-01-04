// pages/signup/photographer.js

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function PhotographerSignup() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    bio: '',
    website: '',
    instagram: '',
    mobile_num: '',
    address: '',
    profile_picture: null,
    subscription_id: '1', // Default subscription ID
  });
  const [error, setError] = useState('');

  // Prevent access if not authenticated
  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    router.push('/signup');
    return null;
  }

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile_picture') {
      setFormData({ ...formData, profile_picture: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Create FormData for file upload
    const data = new FormData();
    data.append('bio', formData.bio);
    data.append('website', formData.website);
    data.append('instagram', formData.instagram);
    data.append('mobile_num', formData.mobile_num);
    data.append('address', formData.address);
    data.append('subscription_id', formData.subscription_id);
    if (formData.profile_picture) {
      data.append('profile_picture', formData.profile_picture);
    }

    try {
      const res = await axios.post('/api/auth/signup/photographer', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.status === 201) {
        // Redirect to photographer dashboard or profile
        router.push('/photographer-dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'An error occurred during photographer signup.');
    }
  };

  return (
    <div className="photographer-signup-container">
      <h1>Photographer Sign-Up</h1>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="photographer-signup-form">
        {/* Bio */}
        <div className="form-group">
          <label htmlFor="bio">Bio:</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        {/* Website */}
        <div className="form-group">
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
        <div className="form-group">
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
        <div className="form-group">
          <label htmlFor="mobile_num">Mobile Number:</label>
          <input
            type="tel"
            id="mobile_num"
            name="mobile_num"
            value={formData.mobile_num}
            onChange={handleChange}
            required
          />
        </div>

        {/* Address */}
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        {/* Profile Picture */}
        <div className="form-group">
          <label htmlFor="profile_picture">Profile Picture:</label>
          <input
            type="file"
            id="profile_picture"
            name="profile_picture"
            accept="image/*"
          />
        </div>

        {/* Subscription */}
        <div className="form-group">
          <label htmlFor="subscription_id">Subscription:</label>
          <select
            id="subscription_id"
            name="subscription_id"
            value={formData.subscription_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Subscription</option>
            <option value="1">Basic - $10/month</option>
            <option value="2">Premium - $20/month</option>
            {/* Add more subscriptions as needed */}
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit" className="signup-button">Complete Sign-Up</button>
      </form>
    </div>
  );
}