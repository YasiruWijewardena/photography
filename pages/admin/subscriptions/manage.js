import { useState, useEffect } from 'react';
import SubscriptionsPage from './index';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]';
import { useRouter } from 'next/router';

export default function ManageSubscriptions({}) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    features: [{ featureName: '', featureValue: '' }],
  });
  const [editSubscriptionId, setEditSubscriptionId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchSubscriptions();
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

  const openModal = (subscription) => {
    // Convert features object to array
    const featuresArray = [];
    for (const [key, value] of Object.entries(subscription.features || {})) {
      featuresArray.push({ featureName: key, featureValue: value });
    }

    setFormData({
      name: subscription.name,
      description: subscription.description,
      price: subscription.price,
      features:
        featuresArray.length > 0
          ? featuresArray
          : [{ featureName: '', featureValue: '' }],
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
      features: [{ featureName: '', featureValue: '' }],
    });
  };

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
    // Convert features array to object
    const featuresObject = {};
    formData.features.forEach((feature) => {
      featuresObject[feature.featureName] = feature.featureValue;
    });

    const updateData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      features: featuresObject,
    };

    const res = await fetch(`/api/subscriptions/${editSubscriptionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });

    if (res.ok) {
      alert('Subscription updated successfully');
      closeModal();
      fetchSubscriptions();
    } else {
      alert('Error updating subscription');
    }
  };

  const deleteSubscription = async () => {
    const confirmDelete = confirm('Are you sure you want to delete this subscription?');
    if (!confirmDelete) return;
    const res = await fetch(`/api/subscriptions/${editSubscriptionId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      alert('Subscription deleted successfully');
      closeModal();
      fetchSubscriptions();
    } else {
      alert('Error deleting subscription');
    }
  };

  return (
    <SubscriptionsPage>
      <h1>Manage Subscriptions</h1>
      <ul className="admins-subs-list">
        {subscriptions.map((subscription) => (
          <li
            key={subscription.id}
            className="admins-subs-list-item"
            onClick={() => openModal(subscription)}
          >
            <h3>
              {subscription.name} - LKR {subscription.price}
            </h3>
            <div className="admins-subs-item-inner">
              <p>{subscription.description}</p>
              <ul className="admins-subs-features">
                {Object.entries(subscription.features || {}).map(
                  ([key, value], idx) => (
                    <li key={idx}>
                      <span>{key}</span> <span>{value}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close-btn" onClick={closeModal}>
              &times;
            </button>
            <h2>Edit Subscription</h2>
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
                  placeholder="LKR"
                  required
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
              <div className="admin-input-container">
                <textarea
                  name="description"
                  placeholder="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="admin-subs-feat-container">
                <h3>Features:</h3>
                {formData.features.map((feature, index) => (
                  <div
                    key={index}
                    className="admin-input-container admin-subs-feat-input-container"
                  >
                    <input
                      type="text"
                      name="featureName"
                      placeholder="feature name"
                      required
                      value={feature.featureName}
                      onChange={(e) => handleFeatureChange(index, e)}
                    />
                    <input
                      type="text"
                      name="featureValue"
                      placeholder="feature value"
                      required
                      value={feature.featureValue}
                      onChange={(e) => handleFeatureChange(index, e)}
                    />
                    <button
                      type="button"
                      className="admin-delete-btn"
                      onClick={() => removeFeature(index)}
                    >
                      -
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <button type="button" className="admin-add-btn" onClick={addFeature}>
                  +
                </button>
              </div>

              <div className="subs-submit-container">
                <button type="button" className="admin-delete-btn" onClick={deleteSubscription}>
                  Delete Subscription
                </button>
                <button type="submit" className="admin-subs-update-btn">
                  Update Subscription
                </button>
                
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
