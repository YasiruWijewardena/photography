// pages/admin/admins/index.js

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import Tabs from '../../../components/Tabs';
import '../../../styles/global.css';

export default function AdminsPage({ children }) {
  const router = useRouter();
  const tabs = [
    { label: 'Approve Admins', href: '/admin/admins/approve' },
    { label: 'Manage Admins', href: '/admin/admins/manage' },
  ];

  useEffect(() => {
    // Redirect to the first tab if no subpath is specified
    if (router.pathname === '/admin/admins') {
      router.replace('/admin/admins/approve');
    }
  }, [router]);

  return (
    <AdminLayout>
      <Tabs tabs={tabs} />
      {children}
    </AdminLayout>
  );
}
