// pages/admin/subscriptions/index.js

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import Tabs from '../../../components/Tabs';
import '../../../styles/global.css'; 

export default function SubscriptionsPage({ children }) {
  const router = useRouter();
  const tabs = [
    { label: 'Manage Features', href: '/admin/subscriptions/features' },
    { label: 'Create Subscription', href: '/admin/subscriptions/create' },
    { label: 'Manage Subscriptions', href: '/admin/subscriptions/manage' },
  ];

  useEffect(() => {
    // Redirect to the first tab if no subpath is specified
    if (router.pathname === '/admin/subscriptions') {
      router.replace('/admin/subscriptions/create');
    }
  }, [router]);

  return (
    <AdminLayout>
      <Tabs tabs={tabs} />
      {children}
    </AdminLayout>
  );
}
