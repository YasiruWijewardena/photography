// // pages/signup.js
// import { useState, useEffect } from 'react';
// import { signIn, useSession } from 'next-auth/react';
// import { useRouter } from 'next/router';
// import axios from 'axios';
// import ProgressBar from '../components/ProgressBar'; // Optional
// import { validateEmail, validatePassword, validateMobileNum } from '../lib/validationUtils';
// import '../styles/public/home.css';
// import '../styles/public/global.css';

// const Signup = () => {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [step, setStep] = useState(1);
//   const [subscriptions, setSubscriptions] = useState([]);
//   const [signupData, setSignupData] = useState({
//     firstname: '',
//     lastname: '',
//     email: '',
//     password: '',
//     role: '',
//     bio: '',
//     website: '',
//     instagram: '',
//     mobile_num: '',
//     address: '',
//     profile_picture: null,
//     subscription_id: '',
//   });
//   const [error, setError] = useState('');

//   // Fetch subscriptions from the API
//   useEffect(() => {
//     const fetchSubscriptions = async () => {
//       try {
//         const res = await axios.get('/api/subscriptions');
//         setSubscriptions(res.data);
//       } catch (err) {
//         console.error('Error fetching subscriptions:', err);
//       }
//     };

//     fetchSubscriptions();
//   }, []);

//   // Determine if user is completing an incomplete signup
//   useEffect(() => {
//     if (status === 'loading') return;

//     if (status === 'authenticated' && session) {
//       if (session.user.role === 'pending') {
//         setStep(2); // Move to role assignment step
//       } else if (session.user.role === 'photographer' && !session.user.photographer_id) {
//         setStep(3); // Move to photographer details step
//       } else if (session.user.role === 'photographer' && session.user.photographer_id) {
//         // Redirect to photographer dashboard
//         router.push('/');
//       } else if (session.user.role === 'customer') {
//         // Redirect to customer dashboard
//         router.push('/customer/dashboard');
//       }
//       // Add more conditions if there are other incomplete states
//     }
//   }, [session, status, router]);

//   // Handle traditional signup form submission
//   const handleTraditionalSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     const { firstname, lastname, email, password } = signupData;

//     // Basic validation
//     if (!firstname || !lastname || !email || !password) {
//       setError('All fields are required.');
//       return;
//     }

//     if (!validateEmail(email)) {
//       setError('Invalid email format.');
//       return;
//     }

//     if (!validatePassword(password)) {
//       setError('Password must be at least 6 characters long.');
//       return;
//     }

//     try {
//       // Call the register API
//       const res = await axios.post('/api/auth/register', { firstname, lastname, email, password }, { withCredentials: true });

//       if (res.status === 201) {
//         // Sign in the user
//         const signInRes = await signIn('credentials', {
//           redirect: false,
//           email,
//           password,
//         });

//         if (signInRes.error) {
//           setError(signInRes.error);
//         } else {
//           // Proceed to role selection
//           setStep(2);
//         }
//       }
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.error || 'An error occurred during signup.');
//     }
//   };

//   // Handle Google sign-up
//   const handleGoogleSignUp = () => {
//     signIn('google', { callbackUrl: '/signup' });
//   };

//   // Handle role selection
//   const handleRoleSelect = async (role) => {
//     setError('');
//     setSignupData({ ...signupData, role });

//     try {
//       // Assign role via API
//       const res = await axios.post('/api/auth/assign-role', { role }, { withCredentials: true });

//       if (res.status === 200) {
//         if (role === 'customer') {
//           // Reload the page to refresh the session and trigger useEffect
//           router.reload();
//         } else if (role === 'photographer') {
//           // Proceed to photographer details
//           setStep(3);
//         }
//       }
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.error || 'An error occurred during role assignment.');
//       setStep(1); // Reset to initial step
//     }
//   };

//   // Handle photographer form submission
//   const handlePhotographerSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     const {
//       bio,
//       website,
//       instagram,
//       mobile_num,
//       address,
//       profile_picture,
//       subscription_id,
//     } = signupData;

//     // Basic validation
//     if (!bio || !mobile_num || !address || !subscription_id) {
//       setError('All photographer fields are required.');
//       return;
//     }

//     if (!validateMobileNum(mobile_num)) {
//       setError('Invalid mobile number.');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('bio', bio);
//       formData.append('website', website);
//       formData.append('instagram', instagram);
//       formData.append('mobile_num', mobile_num);
//       formData.append('address', address);
//       formData.append('subscription_id', subscription_id);
//       if (profile_picture) {
//         formData.append('profile_picture', profile_picture);
//       }

//       const res = await axios.post('/api/auth/update-photographer', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//         withCredentials: true,
//       });

//       if (res.status === 200) {
//         // Reload the page to refresh the session and trigger useEffect
//         router.reload();
//       }
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.error || 'An error occurred during photographer signup.');
//       setStep(2); // Optionally, reset to role assignment
//     }
//   };

//   // Handle file input change
//   const handleFileChange = (e) => {
//     setSignupData({ ...signupData, profile_picture: e.target.files[0] });
//   };

//   return (
//     <div className='signup-page'>
//       <h1>Hello there, glad you are taking the time to join us</h1>
//       {/* <ProgressBar currentStep={step} /> */}

//       {/* Step 1: Traditional Signup Form */}
//       {step === 1 && (
//         <div className='signup-container'>
//           <button type="button" onClick={handleGoogleSignUp} className="google-button">
//             <img src="/google-logo.png" alt="Google Logo" className="google-logo" />
//             Sign Up with Google
//           </button>

//           {/* Divider */}
//           <div className="divider">
//             <span>OR</span>
//           </div>

//           <form onSubmit={handleTraditionalSubmit} className="signup-form">
//             {error && <p className="error">{error}</p>}

//             <div className="signup-input-container">
//               <label>First Name:</label>
//               <input
//                 type="text"
//                 name="firstname"
//                 value={signupData.firstname}
//                 onChange={(e) => setSignupData({ ...signupData, firstname: e.target.value })}
//                 required
//               />
//             </div>
//             <div className="signup-input-container">
//               <label>Last Name:</label>
//               <input
//                 type="text"
//                 name="lastname"
//                 value={signupData.lastname}
//                 onChange={(e) => setSignupData({ ...signupData, lastname: e.target.value })}
//                 required
//               />
//             </div>
//             <div className="signup-input-container">
//               <label>Email:</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={signupData.email}
//                 onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
//                 required
//               />
//             </div>
//             <div className="signup-input-container">
//               <label>Password:</label>
//               <input
//                 type="password"
//                 name="password"
//                 value={signupData.password}
//                 onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
//                 required
//                 minLength={6}
//               />
//             </div>
//             <button type="submit" className="signup-submit">Continue</button>
//           </form>
//         </div>
//       )}

//       {/* Step 2: Role Selection */}
//       {step === 2 && (
//         <div className="role-selection signup-container">
//           <h2>Almost there</h2>
//           {error && <p className="error">{error}</p>}
//           <div className='roles-container'> 
//             <div className='roles-inner'>
//               <p>Sign up as a Customer to view stunning photography from the best photographers.</p>
//               <button onClick={() => handleRoleSelect('customer')} className="roles-submit">
//                 Customer
//               </button>
//             </div>
//             <div className='roles-inner'>
//               <p>Sign up as a Photographer to showcase your stunning portfolio.</p>
//               <button onClick={() => handleRoleSelect('photographer')} className="roles-submit">
//                 Photographer
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Step 3: Photographer Details Form with Subscription Cards */}
//       {step === 3 && (
//         <div className='photographer-details-form signup-container'>
//           <h2>Final Step</h2>
//           <form onSubmit={handlePhotographerSubmit} className="signup-form">
//             {error && <p className="error">{error}</p>}
//             <div className="signup-input-container">
//               <label>Bio:</label>
//               <textarea
//                 name="bio"
//                 value={signupData.bio}
//                 onChange={(e) => setSignupData({ ...signupData, bio: e.target.value })}
//                 required
//               />
//             </div>
//             <div className="signup-input-container">
//               <label>Website:</label>
//               <input
//                 type="url"
//                 name="website"
//                 value={signupData.website}
//                 onChange={(e) => setSignupData({ ...signupData, website: e.target.value })}
//               />
//             </div>
//             <div className="signup-input-container">
//               <label>Instagram:</label>
//               <input
//                 type="text"
//                 name="instagram"
//                 value={signupData.instagram}
//                 onChange={(e) => setSignupData({ ...signupData, instagram: e.target.value })}
//               />
//             </div>
//             <div className="signup-input-container">
//               <label>Mobile Number:</label>
//               <input
//                 type="tel"
//                 name="mobile_num"
//                 value={signupData.mobile_num}
//                 onChange={(e) => setSignupData({ ...signupData, mobile_num: e.target.value })}
//                 required
//               />
//             </div>
//             <div className="signup-input-container">
//               <label>Address:</label>
//               <input
//                 type="text"
//                 name="address"
//                 value={signupData.address}
//                 onChange={(e) => setSignupData({ ...signupData, address: e.target.value })}
//                 required
//               />
//             </div>
//             <div className="signup-input-container">
//               <label>Profile Picture:</label>
//               <input type="file" name="profile_picture" accept="image/*" onChange={(e) => {
//                 setSignupData({ ...signupData, profile_picture: e.target.files[0] });
//               }} />
//             </div>

//             {/* Subscription Plan Selection using Cards */}
//             <div className="signup-input-container">
//               <label>Select Subscription Plan:</label>
//               <div className="subscriptions-cards">
//                 {subscriptions.length ? (
//                   subscriptions.map((sub) => (
//                     <div
//                       key={sub.id}
//                       className={`subscription-card ${signupData.subscription_id === sub.id.toString() ? 'selected' : ''}`}
//                       onClick={() => setSignupData({ ...signupData, subscription_id: sub.id.toString() })}
//                     >
//                       <h3>{sub.name}</h3>
//                       <p>LKR {sub.price}/month</p>
//                       <p>{sub.description}</p>
//                       {sub.planFeatures && sub.planFeatures.length > 0 && (
//                         <ul>
//                           {sub.planFeatures.map((pf, idx) => (
//                             <li key={idx}><span>{pf.subscriptionFeature.key} </span><span>{pf.subscriptionFeature.description} </span><span>{pf.value}</span> </li>
//                           ))}
//                         </ul>
//                       )}
//                     </div>
//                   ))
//                 ) : (
//                   <p>No subscription plans available.</p>
//                 )}
//               </div>
//             </div>

//             <button type="submit" className="signup-submit">Complete Signup</button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Signup;

// pages/signup.js
import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';
import ProgressBar from '../components/ProgressBar'; // Optional
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
  // New state to ensure auto-assignment runs only once
  const [autoAssigned, setAutoAssigned] = useState(false);

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

  // Determine if user is completing an incomplete signup
  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'authenticated' && session) {
      if (session.user.role === 'pending') {
        setStep(2); // Move to role assignment step
      } else if (session.user.role === 'photographer' && !session.user.photographer_id) {
        setStep(3); // Move to photographer details step
      } else if (session.user.role === 'photographer' && session.user.photographer_id) {
        // Redirect to photographer dashboard
        router.push('/');
      } else if (session.user.role === 'customer') {
        // Redirect to customer dashboard
        router.push('/customer/dashboard');
      }
    }
  }, [session, status, router]);

  // New effect: if the URL contains ?role=photographer and the user is pending,
  // auto assign the photographer role and move to step 3.
  useEffect(() => {
    if (
      router.query.role === 'photographer' &&
      status === 'authenticated' &&
      session &&
      session.user.role === 'pending' &&
      !autoAssigned
    ) {
      // Call the role assignment API
      handleRoleSelect('photographer');
      setAutoAssigned(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query, status, session, autoAssigned]);

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
          // Proceed to role selection; the new effect will auto-assign if applicable.
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
          // Reload the page to refresh the session and trigger useEffect
          router.reload();
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
        // Reload the page to refresh the session and trigger useEffect
        router.reload();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'An error occurred during photographer signup.');
      setStep(2); // Optionally, reset to role assignment
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

      {/* Step 2: Role Selection (This step will be auto-handled if ?role=photographer was passed) */}
      {step === 2 && (
        <div className="role-selection signup-container">
          <h2>Almost there</h2>
          {error && <p className="error">{error}</p>}
          <div className='roles-container'> 
            <div className='roles-inner'>
              <p>Sign up as a Customer to view stunning photography from the best photographers.</p>
              <button onClick={() => handleRoleSelect('customer')} className="roles-submit">
                Customer
              </button>
            </div>
            <div className='roles-inner'>
              <p>Sign up as a Photographer to showcase your stunning portfolio.</p>
              <button onClick={() => handleRoleSelect('photographer')} className="roles-submit">
                Photographer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Photographer Details Form with Subscription Cards */}
      {step === 3 && (
        <div className='photographer-details-form signup-container'>
          <h2>Final Step</h2>
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
              <input type="file" name="profile_picture" accept="image/*" onChange={(e) => {
                setSignupData({ ...signupData, profile_picture: e.target.files[0] });
              }} />
            </div>

            {/* Subscription Plan Selection using Cards */}
            <div className="signup-input-container">
              <label>Select Subscription Plan:</label>
              <div className="subscriptions-cards">
                {subscriptions.length ? (
                  subscriptions.map((sub) => (
                    <div
                      key={sub.id}
                      className={`subscription-card ${signupData.subscription_id === sub.id.toString() ? 'selected' : ''}`}
                      onClick={() => setSignupData({ ...signupData, subscription_id: sub.id.toString() })}
                    >
                      <h3>{sub.name}</h3>
                      <p>LKR {sub.price}/month</p>
                      <p>{sub.description}</p>
                      {sub.planFeatures && sub.planFeatures.length > 0 && (
                        <ul>
                          {sub.planFeatures.map((pf, idx) => (
                            <li key={idx}>
                              <span>{pf.subscriptionFeature.key} </span>
                              <span>{pf.subscriptionFeature.description} </span>
                              <span>{pf.value}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No subscription plans available.</p>
                )}
              </div>
            </div>

            <button type="submit" className="signup-submit">Complete Signup</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Signup;