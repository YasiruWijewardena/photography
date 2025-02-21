import { useState, useEffect } from 'react';
import SubscriptionsPage from './index';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]';

export default function ManageSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [globalFeatures, setGlobalFeatures] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    features: [] // will hold { featureName, featureValue } for each global feature
  });
  const [editSubscriptionId, setEditSubscriptionId] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
    fetchGlobalFeatures();
  }, []);

  const fetchSubscriptions = async () => {
    const res = await fetch('/api/subscriptions');
    if (res.ok) {
      const data = await res.json();
      setSubscriptions(data);
    } else {
      console.error('Error fetching subscriptions');
    }
  };

  const fetchGlobalFeatures = async () => {
    const res = await fetch('/api/subscription-features');
    if (res.ok) {
      const data = await res.json();
      setGlobalFeatures(data);
    } else {
      console.error('Error fetching global features');
    }
  };

  const openModal = (subscription) => {
    // Map the global features to include the subscription's current values, if any.
    const mappedFeatures = globalFeatures.map((globalFeature) => {
      // Look for an existing value in subscription.planFeatures
      const found = subscription.planFeatures.find(
        (pf) => pf.subscriptionFeature.key === globalFeature.key
      );
      return {
        featureName: globalFeature.key,
        featureValue: found ? found.value : ''
      };
    });

    setFormData({
      name: subscription.name,
      description: subscription.description,
      price: subscription.price,
      features: mappedFeatures
    });
    setEditSubscriptionId(subscription.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditSubscriptionId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      features: []
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (index, e) => {
    const { name, value } = e.target;
    const newFeatures = [...formData.features];
    newFeatures[index][name] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateData = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      features: formData.features,
    };

    const res = await fetch(`/api/subscriptions/${editSubscriptionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });

    if (res.ok) {
      alert('Subscription plan updated successfully');
      closeModal();
      fetchSubscriptions();
    } else {
      alert('Error updating subscription plan');
    }
  };

  const deleteSubscription = async () => {
    if (!confirm('Are you sure you want to delete this subscription plan?')) return;
    const res = await fetch(`/api/subscriptions/${editSubscriptionId}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      alert('Subscription plan deleted successfully');
      closeModal();
      fetchSubscriptions();
    } else {
      alert('Error deleting subscription plan');
    }
  };

  return (
    <SubscriptionsPage>
      <h1>Manage Subscription Plans</h1>
      <ul className="admins-subs-list">
        {subscriptions.map(subscription => (
          <li key={subscription.id} onClick={() => openModal(subscription)} className='admins-subs-list-item'>
            <h3>{subscription.name} - {subscription.price}</h3>
            <p className='sub-desc'> {subscription.description}</p>
            <ul className='admins-subs-features'>
              {subscription.planFeatures.map((pf, idx) => (
                <li key={idx} className='admins-subs-feature-item'>
                  <span>{pf.subscriptionFeature.key}</span>  
                  <span>{pf.subscriptionFeature.description}</span>
                  <span>{pf.value}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button onClick={closeModal}>&times;</button>
            <h2>Edit Subscription Plan</h2>
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
                <h3>Features:</h3>
                {formData.features.map((feature, index) => (
                  <div key={index} className="admin-input-container admin-subs-feat-input-container">
                    <input 
                      type="text"
                      name="featureName"
                      placeholder="Feature Name"
                      required
                      value={feature.featureName}
                      readOnly
                    />
                    <input 
                      type="text"
                      name="featureValue"
                      placeholder="Feature Value"
                      required
                      value={feature.featureValue}
                      onChange={(e) => handleFeatureChange(index, e)}
                    />
                  </div>
                ))}
              </div>
              <div className="subs-submit-container">
                <button type="button" onClick={deleteSubscription}>Delete Subscription Plan</button>
                <button type="submit" className='admin-secondary-btn'>Update Subscription Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SubscriptionsPage>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session || session.user.role !== 'admin' || session.user.admin_level !== 'SUPER') {
    return {
      redirect: { destination: '/admin', permanent: false }
    };
  }
  return { props: {} };
}