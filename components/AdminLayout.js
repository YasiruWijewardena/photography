// components/AdminLayout.js

import { useSession } from 'next-auth/react';
import Sidebar from './sidebar';

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session || session.user.role !== 'admin') {
    return <p>Access Denied</p>;
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-content">{children}</main>
    </div>
  );
}
