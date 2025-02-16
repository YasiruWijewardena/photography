// pages/photographer/settings.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/react';
import axios from 'axios';
import Image from 'next/image';
import PhotographerLayout from '../../components/PhotographerLayout';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import '../../styles/public/photographerLayout.css';
import { toast } from 'react-hot-toast';
import { useConfirm } from '../../context/ConfirmContext';

export default function Settings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { confirm } = useConfirm();

  // State variables for profile fields
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [mobileNum, setMobileNum] = useState('');
  const [subscriptionId, setSubscriptionId] = useState('');
  const [subscriptionName, setSubscriptionName] = useState('N/A');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);

  // New state variables for available subscriptions (cards)
  const [availableSubscriptions, setAvailableSubscriptions] = useState([]);

  // New state variables for PhotographerLayout props
  const [photographerUsername, setPhotographerUsername] = useState('');
  const [photographerId, setPhotographerId] = useState(null);
  const [albums, setAlbums] = useState([]); // If you have albums data

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserProfile();
    } else if (status === 'unauthenticated') {
      signIn(); // Redirect to sign-in if not authenticated
    }
  }, [status]);

  // When entering edit mode, fetch available subscriptions to display as cards.
  useEffect(() => {
    if (isEditMode) {
      fetchAvailableSubscriptions();
    }
  }, [isEditMode]);

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
      
      // Safely extract subscription info if available
      if (
        data.Photographer?.subscriptions &&
        Array.isArray(data.Photographer.subscriptions) &&
        data.Photographer.subscriptions.length > 0 &&
        data.Photographer.subscriptions[0].subscriptionPlan
      ) {
        setSubscriptionId(
          data.Photographer.subscriptions[0].subscriptionPlan.id.toString()
        );
        setSubscriptionName(
          data.Photographer.subscriptions[0].subscriptionPlan.name
        );
      } else {
        setSubscriptionId('');
        setSubscriptionName('N/A');
      }
      
      setProfilePicturePreview(data.Photographer?.profile_picture || null);

      // Set PhotographerLayout related props
      setPhotographerUsername(data.username || '');
      setPhotographerId(data.id || null);

      // If you have albums data, set it here
      // setAlbums(data.albums || []);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSubscriptions = async () => {
    try {
      const res = await axios.get('/api/subscriptions');
      if (res.status === 200) {
        setAvailableSubscriptions(res.data);
      }
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setProfilePicturePreview(URL.createObjectURL(file));
    }
  };

  const handleSubscriptionSelect = (sub) => {
    setSubscriptionId(sub.id.toString());
    setSubscriptionName(sub.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!firstname || !lastname || !session?.user?.email) {
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
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Profile updated successfully');
      setIsEditMode(false);
      fetchUserProfile();
    } catch (err) {
      console.error('Error updating profile:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    const isConfirmed = await confirm('Are you sure you want to delete your profile? This action cannot be undone.');
    if (!isConfirmed) return;
    try {
      setLoading(true);
      const response = await axios.delete('/api/photographer/delete-profile');
      toast.success(response.data.message);
      signOut({ callbackUrl: '/' });
    } catch (err) {
      console.error('Error deleting profile:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to delete profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  if (loading && !profilePicturePreview) return <p>Loading...</p>;
  if (!photographerUsername || !photographerId) return <p>Loading...</p>;

  return (
    <PhotographerLayout
      isOwner={true}
      photographerUsername={photographerUsername}
      photographerId={photographerId}
      useAlbumSidebar={false}
      albums={albums}
    >
      <div className="settings-page">
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
                <div className="profile-details-inner">
                  <p className="profile-details-label"><span>Firstname:</span></p>
                  <p className="profile-detail-val">{firstname}</p>
                </div>
                <div className="profile-details-inner">
                  <p className="profile-details-label"><span>Lastname:</span></p>
                  <p className="profile-detail-val">{lastname}</p>
                </div>
                <div className="profile-details-inner">
                  <p className="profile-details-label"><span>Email:</span></p>
                  <p className="profile-detail-val">{session?.user?.email}</p>
                </div>
                <div className="profile-details-inner">
                  <p className="profile-details-label"><span>Bio:</span></p>
                  <p className="profile-detail-val">{bio || 'N/A'}</p>
                </div>
                <div className="profile-details-inner">
                  <p className="profile-details-label"><span>Website:</span></p>
                  <p className="profile-detail-val">{website || 'N/A'}</p>
                </div>
                <div className="profile-details-inner">
                  <p className="profile-details-label"><span>Instagram:</span></p>
                  <p className="profile-detail-val">{instagram || 'N/A'}</p>
                </div>
                <div className="profile-details-inner">
                  <p className="profile-details-label"><span>Mobile Number:</span></p>
                  <p className="profile-detail-val">{mobileNum || 'N/A'}</p>
                </div>
                <div className="profile-details-inner">
                  <p className="profile-details-label"><span>Subscription:</span></p>
                  <p className="profile-detail-val">{subscriptionName || 'N/A'}</p>
                </div>
              </div>
              <button onClick={() => setIsEditMode(true)} className="edit-button">
                <EditRoundedIcon />
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="settings-form">
              <div className="form-group">
                <label htmlFor="firstname">Firstname:</label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                />
                <label htmlFor="lastname">Lastname:</label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                />
              </div>
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
              
              {/* Subscription Options as Cards */}
              <div className="form-group">
                <label>Select Subscription:</label>
                <div className="subscriptions-cards">
                  {availableSubscriptions.length > 0 ? (
                    availableSubscriptions.map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => handleSubscriptionSelect(sub)}
                        className={`subscription-card ${
                          subscriptionId === sub.id.toString() ? 'selected' : ''
                        }`}
                        style={{
                          border: '1px solid #ccc',
                          borderRadius: '8px',
                          padding: '16px',
                          margin: '8px',
                          cursor: 'pointer',
                        }}
                      >
                        <h3>{sub.name}</h3>
                        <p>${sub.price}/month</p>
                        <p>{sub.description}</p>
                        {sub.planFeatures && sub.planFeatures.length > 0 && (
                          <ul>
                            {sub.planFeatures.map((pf, idx) => (
                              <li key={idx}>
                                {pf.subscriptionFeature.key}: {pf.value}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No subscriptions available.</p>
                  )}
                </div>
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
                <div className="change-profile-section">
                  <button type="submit" disabled={loading} className="submit-button">
                    {loading ? 'Updating...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditMode(false);
                      setError(null);
                      fetchUserProfile();
                    }}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                </div>
                <div className="delete-profile-section">
                  <button
                    type="button"
                    onClick={handleDeleteProfile}
                    className="delete-button"
                    disabled={loading}
                  >
                    <DeleteForeverRoundedIcon />
                    Delete Profile
                  </button>
                </div>
              </div>
            </form>
          )}
          <div className="logout-btn-container">
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </div>
    </PhotographerLayout>
  );
}