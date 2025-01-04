// pages/role-selection.js

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function RoleSelection() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState('');

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>You must be signed in to view this page.</p>;
  }

  const handleRoleSelection = async (role) => {
    try {
      const res = await fetch('/api/auth/assign-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: session.user.email, role }),
      });

      if (res.ok) {
        // Redirect based on role
        if (role === 'customer') {
          router.push('/customer-dashboard');
        } else if (role === 'photographer') {
          router.push('/photographer-dashboard');
        }
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Error assigning role');
      }
    } catch (err) {
      console.error(err);
      setError('Error assigning role');
    }
  };

  return (
    <div className="role-selection-page">
      <h1>Select Your Role</h1>
      {error && <p className="error">{error}</p>}
      <button onClick={() => handleRoleSelection('customer')} className="role-button">
        Customer
      </button>
      <button onClick={() => handleRoleSelection('photographer')} className="role-button">
        Photographer
      </button>
      <button onClick={() => signOut()} className="signout-button">
        Sign Out
      </button>
    </div>
  );
}