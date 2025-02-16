import { useState, useEffect } from 'react';
import SubscriptionsPage from './index';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]';

export default function ManageFeatures() {
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState({ key: '', description: '', dataType: 'string' });

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    const res = await fetch('/api/subscription-features');
    if (res.ok) {
      const data = await res.json();
      setFeatures(data);
    } else {
      console.error('Error fetching features');
    }
  };

  const handleNewFeatureChange = (e) => {
    const { name, value } = e.target;
    setNewFeature(prev => ({ ...prev, [name]: value }));
  };

  const addFeature = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/subscription-features', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFeature)
    });
    if (res.ok) {
      alert('Feature added successfully');
      setNewFeature({ key: '', description: '', dataType: 'string' });
      fetchFeatures();
    } else {
      alert('Error adding feature');
    }
  };

  const deleteFeature = async (id) => {
    if (!confirm('Are you sure you want to delete this feature?')) return;
    const res = await fetch(`/api/subscription-features/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      alert('Feature deleted successfully');
      fetchFeatures();
    } else {
      alert('Error deleting feature');
    }
  };

  return (
    <SubscriptionsPage>
      <div className="admin-container">
        <h1>Manage Subscription Features</h1>
        <ul className='feature-list'>
          {features.map(feature => (
            <li key={feature.id} className='feature-item'>
              <span>{feature.key}</span> 
              <span>{feature.description} </span>
              <span>{feature.dataType}</span>
              <button type="button" onClick={() => deleteFeature(feature.id)} className='feature-delete'>
                Delete
              </button>
            </li>
          ))}
        </ul>
        <form onSubmit={addFeature} className='feature-form'>
          <div className='admin-input-container'>
          <input 
            type="text" 
            name="key" 
            placeholder="Feature Key" 
            required
            value={newFeature.key}
            onChange={handleNewFeatureChange}
          />
          </div>

          <div className='admin-input-container'>
          <input 
            type="text" 
            name="description" 
            placeholder="Description" 
            value={newFeature.description}
            onChange={handleNewFeatureChange}
          />
          </div>
          
          
          <select name="dataType" value={newFeature.dataType} onChange={handleNewFeatureChange}>
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
          </select>
          <button type="submit">Add Feature</button>
        </form>
      </div>
    </SubscriptionsPage>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session || session.user.role !== 'admin' || session.user.admin_level !== 'SUPER') {
    return { redirect: { destination: '/admin', permanent: false } };
  }
  return { props: {} };
}