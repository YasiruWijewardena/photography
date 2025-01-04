// pages/signup/role-selection.js

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function RoleSelection() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState('');

  // Handle role selection
  const handleRoleSelection = async (selectedRole) => {
    setError('');

    try {
      const res = await axios.post('/api/auth/assign-role', { role: selectedRole });
      if (res.status === 200) {
        if (selectedRole === 'customer') {
          router.push('/login');
        } else if (selectedRole === 'photographer') {
          router.push('/signup/photographer');
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'An error occurred while assigning role.');
    }
  };

  // Prevent access if not authenticated
  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    router.push('/signup');
    return null;
  }

  return (
    <div className="role-selection-container">
      <h1>Select Your Role</h1>

      {error && <p className="error-message">{error}</p>}

      <button onClick={() => handleRoleSelection('customer')} className="role-button">
        Customer
      </button>

      <button onClick={() => handleRoleSelection('photographer')} className="role-button">
        Photographer
      </button>
    </div>
  );
}