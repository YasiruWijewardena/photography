// components/Settings.js

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Settings({ username }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDeleteAccount = async () => {
    const confirmDelete = confirm('Are you sure you want to delete your account? This action cannot be undone.');

    if (!confirmDelete) return;

    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/customer/${username}/delete-account`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Sign out and redirect to homepage
        signOut({ callbackUrl: '/' });
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete account.');
      }
    } catch (err) {
      console.error('Error deleting account:', err);
      setError(err.message);
      setDeleting(false);
    }
  };

  return (
    <div className="settings">
      <h2>Settings</h2>
      <button onClick={() => signOut({ callbackUrl: '/' })} className="signout-button">
        Sign Out
      </button>
      <hr />
      <button onClick={handleDeleteAccount} className="delete-account-button" disabled={deleting}>
        {deleting ? 'Deleting Account...' : 'Delete Account'}
      </button>
      {error && <p className="error-message">{error}</p>}
      <style jsx>{`
        .settings {
          padding: 20px;
        }

        .signout-button,
        .delete-account-button {
          padding: 10px 20px;
          margin: 10px 0;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }

        .signout-button {
          background-color: #0070f3;
          color: #fff;
        }

        .delete-account-button {
          background-color: #e53e3e;
          color: #fff;
        }

        .delete-account-button:disabled {
          background-color: #c53030;
          cursor: not-allowed;
        }

        .error-message {
          color: red;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
}