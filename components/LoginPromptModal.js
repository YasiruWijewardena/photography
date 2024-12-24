// components/LoginPromptModal.js

import React from 'react';
import Modal from 'react-modal';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';

// Bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
if (typeof window !== 'undefined') {
  Modal.setAppElement('#__next');
}

export default function LoginPromptModal({ isOpen, onRequestClose }) {
  const router = useRouter();

  const handleLoginRedirect = () => {
    onRequestClose();
    router.push('/login'); 
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Login Required"
      className="login-modal"
      overlayClassName="login-overlay"
      shouldCloseOnEsc={true} 
    >
      <div
        className="login-modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from propagating
      >
        <h2>Login Required</h2>
        <p>You need to log in to like or favourite photos.</p>
        <div className="login-modal-actions">
          <Button variant="contained" color="primary" onClick={handleLoginRedirect}>
            Login
          </Button>
          <Button variant="outlined" color="secondary" onClick={onRequestClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
