// pages/photographer/settings.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/react';
import axios from 'axios';
import Image from 'next/image';
import Sidebar from '../../components/SettingsSidebar'; // Adjust the path based on your project structure

export default function Settings() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State variables for profile fields
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [mobileNum, setMobileNum] = useState('');
  const [subscriptionId, setSubscriptionId] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch current user profile on component mount
  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserProfile();
    } else if (status === 'unauthenticated') {
      signIn(); // Redirect to sign-in if not authenticated
    }
  }, [status]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/photographer/get-profile');
      const data = response.data.user;
      
      setFirstname(data.firstname || '');
      setLastname(data.lastname || '');
      setUsername(data.username || '');
      setBio(data.Photographer?.bio || '');
      setWebsite(data.Photographer?.website || '');
      setInstagram(data.Photographer?.instagram || '');
      setMobileNum(data.Photographer?.mobile_num?.toString() || '');
      setSubscriptionId(data.Photographer?.subscription_id?.toString() || '');
      setProfilePicturePreview(data.Photographer?.profile_picture || null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setProfilePicturePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!firstname || !lastname || !session?.user?.email) { // Assuming email is required
      setError('Full name and email are required.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('firstname', firstname);
    formDataToSend.append('lastname', lastname);
    formDataToSend.append('bio', bio);
    formDataToSend.append('website', website);
    formDataToSend.append('instagram', instagram);
    formDataToSend.append('mobile_num', mobileNum);
    formDataToSend.append('subscription_id', subscriptionId);
    if (profilePicture) {
      formDataToSend.append('profile_picture', profilePicture);
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/photographer/update-profile', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Profile updated successfully.');
      setIsEditMode(false); // Exit edit mode after successful update
      fetchUserProfile(); // Refresh profile data
    } catch (err) {
      console.error('Error updating profile:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' }); 
  };

  if (loading && !profilePicturePreview) return <p>Loading...</p>;

  return (
    <div className="settings-page">
      <Sidebar 
      photographerUsername={username}
      /> 
      <div className="settings-content">
        <h1>Settings</h1>
        {error && <p className="error-message">{error}</p>}
        {!isEditMode ? (
          <div className="profile-view">
            <div className="profile-picture">
              {profilePicturePreview ? (
                <Image
                  src={profilePicturePreview}
                  alt="Profile Picture"
                  width={150}
                  height={150}
                  objectFit="cover"
                  className="rounded-full"
                />
              ) : (
                <div className="placeholder-picture">No Image</div>
              )}
            </div>
            <div className="profile-details">
              <p><strong>Firstname:</strong> {firstname}</p>
              <p><strong>Lastname:</strong> {lastname}</p>
              <p><strong>Email:</strong> {session?.user?.email}</p>
              <p><strong>Bio:</strong> {bio || 'N/A'}</p>
              <p><strong>Website:</strong> {website || 'N/A'}</p>
              <p><strong>Instagram:</strong> {instagram || 'N/A'}</p>
              <p><strong>Mobile Number:</strong> {mobileNum || 'N/A'}</p>
              <p><strong>Subscription ID:</strong> {subscriptionId || 'N/A'}</p>
            </div>
            <button onClick={() => setIsEditMode(true)} className="edit-button">
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="settings-form">
            <div className="form-group">
              <label htmlFor="username">Firstname:</label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />

              <label htmlFor="username">Lastname:</label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
            </div>

            {/* Email Field (Read-Only) */}
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={session?.user?.email || ''}
                readOnly
                disabled
              />
            </div>

            {/* Bio Field */}
            <div className="form-group">
              <label htmlFor="bio">Bio:</label>
              <textarea
                id="bio"
                name="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows="4"
              ></textarea>
            </div>

            {/* Website Field */}
            <div className="form-group">
              <label htmlFor="website">Website:</label>
              <input
                type="text"
                id="website"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            {/* Instagram Field */}
            <div className="form-group">
              <label htmlFor="instagram">Instagram:</label>
              <input
                type="text"
                id="instagram"
                name="instagram"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
              />
            </div>

            {/* Mobile Number Field */}
            <div className="form-group">
              <label htmlFor="mobile_num">Mobile Number:</label>
              <input
                type="tel"
                id="mobile_num"
                name="mobile_num"
                value={mobileNum}
                onChange={(e) => setMobileNum(e.target.value)}
              />
            </div>

            {/* Subscription ID Field */}
            <div className="form-group">
              <label htmlFor="subscription_id">Subscription ID:</label>
              <input
                type="text"
                id="subscription_id"
                name="subscription_id"
                value={subscriptionId}
                onChange={(e) => setSubscriptionId(e.target.value)}
              />
            </div>

            {/* Profile Picture Field */}
            <div className="form-group">
              <label htmlFor="profile_picture">Profile Picture:</label>
              <input
                type="file"
                id="profile_picture"
                name="profile_picture"
                accept="image/*"
                onChange={handleImageChange}
              />
              {profilePicturePreview && (
                <div className="image-preview">
                  <Image
                    src={profilePicturePreview}
                    alt="Profile Preview"
                    width={150}
                    height={150}
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading} className="submit-button">
                {loading ? 'Updating...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditMode(false);
                  setError(null);
                  fetchUserProfile(); // Reset changes
                }}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Optional: Logout Button */}
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      {/* Styling */}
      <style jsx>{`
        .settings-page {
          display: flex;
        }
        .settings-content {
          flex: 1;
          padding: 20px;
        }
        .profile-view {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .profile-picture {
          margin-bottom: 20px;
        }
        .placeholder-picture {
          width: 150px;
          height: 150px;
          background-color: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #a0aec0;
          font-size: 16px;
        }
        .profile-details {
          margin-top: 20px;
          width: 100%;
          max-width: 500px;
        }
        .profile-details p {
          margin: 5px 0;
        }
        .edit-button,
        .submit-button,
        .cancel-button,
        .logout-button {
          padding: 10px 20px;
          margin: 10px 5px 0 5px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .edit-button {
          background-color: #0070f3;
          color: #ffffff;
        }
        .edit-button:hover {
          background-color: #005bb5;
        }
        .submit-button {
          background-color: #38a169;
          color: #ffffff;
        }
        .submit-button:hover {
          background-color: #2f855a;
        }
        .cancel-button {
          background-color: #e53e3e;
          color: #ffffff;
        }
        .cancel-button:hover {
          background-color: #c53030;
        }
        .logout-button {
          background-color: #a0aec0;
          color: #ffffff;
          margin-top: 20px;
        }
        .logout-button:hover {
          background-color: #718096;
        }
        .error-message {
          color: red;
          margin-bottom: 10px;
        }
        .settings-form {
          display: flex;
          flex-direction: column;
        }
        .form-group {
          margin-bottom: 15px;
          display: flex;
          flex-direction: column;
        }
        .form-group label {
          margin-bottom: 5px;
          font-weight: bold;
        }
        .form-group input[type="text"],
        .form-group input[type="email"],
        .form-group input[type="file"],
        .form-group textarea {
          padding: 8px;
          font-size: 16px;
          border: 1px solid #cccccc;
          border-radius: 4px;
        }
        .image-preview {
          margin-top: 10px;
        }
        .form-actions {
          display: flex;
          gap: 10px;
        }
      `}</style>
    </div>
  );
}
