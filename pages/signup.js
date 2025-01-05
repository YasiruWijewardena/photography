// pages/signup.js

import { useState, useEffect } from 'react';
import { signIn, signOut, useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';
import ProgressBar from '../components/ProgressBar';
import { validateEmail, validatePassword, validateMobileNum } from '../lib/validationUtils';
import '../styles/public/home.css';
import '../styles/public/global.css';

const Signup = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [subscriptions, setSubscriptions] = useState([]);
  const [signupData, setSignupData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: '',
    bio: '',
    website: '',
    instagram: '',
    mobile_num: '',
    address: '',
    profile_picture: null,
    subscription_id: '',
  });
  const [error, setError] = useState('');

  // Fetch subscriptions from the API
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await axios.get('/api/subscriptions');
        setSubscriptions(res.data);
      } catch (err) {
        console.error('Error fetching subscriptions:', err);
      }
    };

    fetchSubscriptions();
  }, []);

  // Handle redirection after Google OAuth sign-in
  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'authenticated') {
      // If user is authenticated but has no role, proceed to role selection
      if (!session.user.role || session.user.role === 'pending') {
        setStep(2);
      } else {
        // User has role; redirect accordingly
        if (session.user.role === 'customer') {
          router.push('/login');
        } else if (session.user.role === 'photographer') {
          setStep(3);
        }else {
          router.push('/'); // Default redirect
        }
      }
    }
  }, [session, status, router]);

  // Handle traditional signup form submission
  const handleTraditionalSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { firstname, lastname, email, password } = signupData;

    // Basic validation
    if (!firstname || !lastname || !email || !password) {
      setError('All fields are required.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Invalid email format.');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      // Call the register API
      const res = await axios.post('/api/auth/register', { firstname, lastname, email, password }, { withCredentials: true });

      if (res.status === 201) {
        // Sign in the user
        const signInRes = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });

        if (signInRes.error) {
          setError(signInRes.error);
        } else {
          // Proceed to role selection
          setStep(2);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'An error occurred during signup.');
    }
  };

  // Handle Google sign-up
  const handleGoogleSignUp = () => {
    signIn('google', { callbackUrl: '/signup' });
  };

  // Handle role selection
  const handleRoleSelect = async (role) => {
    setError('');
    setSignupData({ ...signupData, role });

    try {
      // Assign role via API
      const res = await axios.post('/api/auth/assign-role', { role }, { withCredentials: true });

      if (res.status === 200) {
        if (role === 'customer') {
          // Sign out the user to clear the current session
          await signOut({ redirect: false });
          // Redirect to login page
          router.push('/login');
        } else if (role === 'photographer') {
          // Proceed to photographer details
          setStep(3);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'An error occurred during role assignment.');
      setStep(1); // Reset to initial step
    }
  };

  // Handle photographer form submission
  const handlePhotographerSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const {
      bio,
      website,
      instagram,
      mobile_num,
      address,
      profile_picture,
      subscription_id,
    } = signupData;

    // Basic validation
    if (!bio || !mobile_num || !address || !subscription_id) {
      setError('All photographer fields are required.');
      return;
    }

    if (!validateMobileNum(mobile_num)) {
      setError('Invalid mobile number.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('bio', bio);
      formData.append('website', website);
      formData.append('instagram', instagram);
      formData.append('mobile_num', mobile_num);
      formData.append('address', address);
      formData.append('subscription_id', subscription_id);
      if (profile_picture) {
        formData.append('profile_picture', profile_picture);
      }

      const res = await axios.post('/api/auth/update-photographer', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (res.status === 200) {
         // Sign out the user to clear the current session
         await signOut({ redirect: false });
         // Redirect to login page
         router.push('/login');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'An error occurred during photographer signup.');
      setStep(1); // Reset to initial step
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setSignupData({ ...signupData, profile_picture: e.target.files[0] });
  };

  return (
    <div className='signup-page'>
      <h1>Hello there, glad you are taking the time to join us</h1>
      {/* <ProgressBar currentStep={step} /> */}

      {/* Step 1: Traditional Signup Form */}
      {step === 1 && (
        <div className='signup-container'>
          <button type="button" onClick={handleGoogleSignUp} className="google-button">
            <img src="/google-logo.png" alt="Google Logo" className="google-logo" />
            Sign Up with Google
          </button>

          {/* Divider */}
          <div className="divider">
            <span>OR</span>
          </div>

          <form onSubmit={handleTraditionalSubmit} className="signup-form">
          {error && <p className="error">{error}</p>}

          

          <div className="signup-input-container">
            <label>First Name:</label>
            <input
              type="text"
              name="firstname"
              value={signupData.firstname}
              onChange={(e) => setSignupData({ ...signupData, firstname: e.target.value })}
              required
            />
          </div>
          <div className="signup-input-container">
            <label>Last Name:</label>
            <input
              type="text"
              name="lastname"
              value={signupData.lastname}
              onChange={(e) => setSignupData({ ...signupData, lastname: e.target.value })}
              required
            />
          </div>
          <div className="signup-input-container">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={signupData.email}
              onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
              required
            />
          </div>
          <div className="signup-input-container">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={signupData.password}
              onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="signup-submit">Continue</button>
          
        </form>
        </div>
        
      )}

      {/* Step 2: Role Selection */}
      {step === 2 && (
        <div className="role-selection signup-container">
          <h2>Almost there </h2>
          {error && <p className="error">{error}</p>}
          <div className='roles-container'> 
            <div className='roles-inner'>
              <p>Sign up as a Customer to view stunning photography from best photographers</p>
              <button onClick={() => handleRoleSelect('customer')} className="roles-submit">
                Customer
              </button>
            </div>
            <div className='roles-inner'>
            <p>Sign up as a photographer to showcase your stunning portfolio</p>
              <button onClick={() => handleRoleSelect('photographer')} className="roles-submit">
                Photographer
              </button>
            </div>
            
            
          </div>
          
        </div>
      )}

      {/* Step 3: Photographer Details Form */}
      {step === 3 && (
        <div className='photographer-details-form signup-container'>
        <h2>Final step </h2>
        <form onSubmit={handlePhotographerSubmit} className="signup-form">
          {error && <p className="error">{error}</p>}
          <div className="signup-input-container">
            <label>Bio:</label>
            <textarea
              name="bio"
              value={signupData.bio}
              onChange={(e) => setSignupData({ ...signupData, bio: e.target.value })}
              required
            />
          </div>
          <div className="signup-input-container">
            <label>Website:</label>
            <input
              type="url"
              name="website"
              value={signupData.website}
              onChange={(e) => setSignupData({ ...signupData, website: e.target.value })}
            />
          </div>
          <div className="signup-input-container">
            <label>Instagram:</label>
            <input
              type="text"
              name="instagram"
              value={signupData.instagram}
              onChange={(e) => setSignupData({ ...signupData, instagram: e.target.value })}
            />
          </div>
          <div className="signup-input-container">
            <label>Mobile Number:</label>
            <input
              type="tel"
              name="mobile_num"
              value={signupData.mobile_num}
              onChange={(e) => setSignupData({ ...signupData, mobile_num: e.target.value })}
              required
            />
          </div>
          <div className="signup-input-container">
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={signupData.address}
              onChange={(e) => setSignupData({ ...signupData, address: e.target.value })}
              required
            />
          </div>
          <div className="signup-input-container">
            <label>Profile Picture:</label>
            <input type="file" name="profile_picture" accept="image/*" onChange={handleFileChange} />
          </div>
          <div className="signup-input-container">
            <label>Subscription Plan:</label>
            <select
              name="subscription_id"
              value={signupData.subscription_id}
              onChange={(e) => setSignupData({ ...signupData, subscription_id: e.target.value })}
              required
            >
              <option value="">Select Subscription</option>
              {subscriptions.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name} - ${sub.price}/month
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="signup-submit">Complete Signup</button>
        </form>
        </div>
        
      )}
    </div>
  );
};

export default Signup;