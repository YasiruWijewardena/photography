// pages/admin/subscriptions/create.js

import { useState, useEffect } from 'react';
import SubscriptionsPage from './index';
import { getSession } from 'next-auth/react';

export default function CreateSubscription() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    featureValues: {}  // a mapping: { featureKey: value }
  });
  const [availableFeatures, setAvailableFeatures] = useState([]);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    const res = await fetch('/api/subscription-features');
    if (res.ok) {
      const data = await res.json();
      setAvailableFeatures(data);
      // Initialize featureValues with empty strings for each feature key
      const initialValues = {};
      data.forEach(feature => {
        initialValues[feature.key] = '';
      });
      setFormData(prev => ({ ...prev, featureValues: initialValues }));
    } else {
      console.error('Error fetching subscription features');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      featureValues: { ...prev.featureValues, [name]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Convert featureValues object into an array of { featureName, featureValue }
    const featuresArray = Object.entries(formData.featureValues).map(([key, value]) => ({
      featureName: key,
      featureValue: value
    }));
    const payload = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      features: featuresArray
    };
    const res = await fetch('/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      alert('Subscription plan created successfully');
      // Reset form fields
      setFormData({
        name: '',
        description: '',
        price: '',
        featureValues: availableFeatures.reduce((acc, feat) => ({ ...acc, [feat.key]: '' }), {})
      });
    } else {
      alert('Error creating subscription plan');
    }
  };

  return (
    <SubscriptionsPage>
      <div className="admin-container admin-subs-container">
        <h1 className="admin-header">Create Subscription Plan</h1>
        <form onSubmit={handleSubmit} className="admin-subs-form">
          <div className="admin-input-container admin-subs-input-container">
            <input 
              type="text"
              name="name"
              placeholder="Name"
              required
              value={formData.name}
              onChange={handleChange}
            />
            <input 
              type="number"
              name="price"
              placeholder="Price"
              required
              step="0.01"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          <div className="admin-input-container">
            <textarea 
              name="description"
              placeholder="Description"
              required
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="admin-subs-feat-container">
            <h3>Set Feature Values:</h3>
            {availableFeatures.map(feature => (
              <div key={feature.id} className="admin-input-container admin-subs-feat-input-container">
                <label>{feature.key}</label>
                <input 
                  type="text"
                  name={feature.key}
                  placeholder={`Value for ${feature.key}`}
                  value={formData.featureValues[feature.key] || ''}
                  onChange={handleFeatureChange}
                />
              </div>
            ))}
          </div>
          <div className="subs-submit-container">
            <button type="submit" className='admin-primary-btn'>Create Subscription Plan</button>
          </div>
        </form>
      </div>
    </SubscriptionsPage>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session || session.user.role !== 'admin' || session.user.admin_level !== 'SUPER') {
    return { redirect: { destination: '/admin', permanent: false } };
  }
  return { props: {} };
}