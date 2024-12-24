// pages/signup.js

import { useState } from 'react';
import CustomerSignupForm from '../components/CustomerSignupForm';
import PhotographerSignupForm from '../components/PhotographerSignupForm';
import '../styles/public/home.css';
import '../styles/public/global.css';

export default function Signup() {
  const [activeTab, setActiveTab] = useState('customer');

  return (
    <div className="signup-page">
      <h1>Sign Up</h1>
      <div className="signup-tabs">
        <button
          className={`tab-button ${activeTab === 'customer' ? 'active' : ''}`}
          onClick={() => setActiveTab('customer')}
        >
          Customer
        </button>
        <button
          className={`tab-button ${activeTab === 'photographer' ? 'active' : ''}`}
          onClick={() => setActiveTab('photographer')}
        >
          Photographer
        </button>
      </div>
      <div className="signup-form-container">
        {activeTab === 'customer' && <CustomerSignupForm />}
        {activeTab === 'photographer' && <PhotographerSignupForm />}
      </div>
    </div>
  );
}

function CustomerForm() {
  return <div>Customer Signup Form</div>;
}

function PhotographerForm() {
  return <div>Photographer Signup Form</div>;
}