// pages/admin/photographers/index.js

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import Tabs from '../../../components/Tabs';

export default function PhotographersPage({ children }) {
  const router = useRouter();
  const tabs = [
    { label: 'Approve Photographers', href: '/admin/photographers/approve' },
    { label: 'Manage Photographers', href: '/admin/photographers/manage' },
  ];

  useEffect(() => {
    // Redirect to the first tab if no subpath is specified
    if (router.pathname === '/admin/photographers') {
      router.replace('/admin/photographers/approve');
    }
  }, [router]);

  return (
    <AdminLayout>
      <Tabs tabs={tabs} />
      {children}
    </AdminLayout>
  );
}
