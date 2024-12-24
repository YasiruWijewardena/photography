// pages/admin/dashboard.js

import { getSession } from 'next-auth/react';

import AdminLayout from '../../components/AdminLayout';

export default function AdminDashboard() {
  return (
    <AdminLayout>
      
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (
    !session ||
    session.user.role !== 'admin' ||
    !['BASIC', 'SUPER'].includes(session.user.admin_level)
  ) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

