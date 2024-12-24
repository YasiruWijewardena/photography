// pages/admin/subscriptions/create.js

import { useState } from 'react';
import SubscriptionsPage from './index';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default function CreateSubscription() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    features: [{ featureName: '', featureValue: '' }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFeatureChange = (index, e) => {
    const { name, value } = e.target;
    const features = [...formData.features];
    features[index][name] = value;
    setFormData({ ...formData, features });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { featureName: '', featureValue: '' }],
    });
  };

  const removeFeature = (index) => {
    const features = [...formData.features];
    features.splice(index, 1);
    setFormData({ ...formData, features });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert('Subscription created successfully');
      // Reset form or redirect as needed
    } else {
      alert('Error creating subscription');
    }
  };

  return (
    <SubscriptionsPage>
       <div className="admin-container admin-subs-container">
       <h1 className="admin-header">Create Subscription</h1>
      <form onSubmit={handleSubmit} className='admin-subs-form'>
        
        <div className="admin-input-container admin-subs-input-container">
          {/* Subscription Name */}
        <input
            type="text"
            name="name"
            placeholder='Name'
            required
            value={formData.name}
            onChange={handleChange}
          />
          {/* Price */}
          <input
            type="number"
            name="price"
            placeholder='LKR'
            required
            step="0.01"
            value={formData.price}
            onChange={handleChange}
          />
        </div>
          
        {/* Description */}
        <div className="admin-input-container">
          <textarea
            name="description"
            placeholder='description'
            required
            value={formData.description}
            onChange={handleChange}
          ></textarea></div>
        
        {/* Features */}
        <div className='admin-subs-feat-container'>
          <h3>Features:</h3>
          {formData.features.map((feature, index) => (
            <div key={index} className="admin-input-container admin-subs-feat-input-container">
              
                <input
                  type="text"
                  name="featureName"
                  placeholder='feature name'
                  required
                  value={feature.featureName}
                  onChange={(e) => handleFeatureChange(index, e)}
                />
              
            
                <input
                  type="text"
                  name="featureValue"
                  placeholder='feature value'
                  required
                  value={feature.featureValue}
                  onChange={(e) => handleFeatureChange(index, e)}
                />
              
              <button type="button" className='admin-delete-btn' onClick={() => removeFeature(index)}>
                -
              </button>
            </div>
          ))}
        </div>
        
        <div>
        <button type="button" className='admin-add-btn' onClick={addFeature}>
          +
        </button>
        </div>
        
        {/* Submit */}
        <div className='subs-submit-container'><button type="submit" className='admin-primary-btn'>Create Subscription</button></div>

        
      </form>
       </div>
      
    </SubscriptionsPage>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || session.user.role !== 'admin' || session.user.admin_level !== 'SUPER') {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
