// pages/admin/admins/manage.js

import AdminsPage from '.';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';
import AdminLayout from '../../../components/AdminLayout';
import Link from 'next/link';
import { serializeData } from '../../../lib/serialize';

export default function ManageAdmins({ admins }) {
  return (
    <AdminsPage>
      <h1>Manage Admins</h1>
      {admins.length === 0 ? (
        <p>No basic admins found.</p>
      ) : (
        <div className="admins-list">
          {admins.map((admin) => (
            <Link
              href={`/admin/admins/manage/${admin.admin_id}`}
              key={admin.admin_id}
              className="admins-list-item"
            >
              <p>{admin.User.email}</p>
              <p>Level: {admin.admin_level}</p>
            </Link>
          ))}
        </div>
      )}
    </AdminsPage>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (
    !session ||
    session.user.role !== 'admin' ||
    session.user.admin_level !== 'SUPER'
  ) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  const admins = await prisma.admin.findMany({
    where: { is_approved: true, admin_level: 'BASIC' },
    include: { User: true },
  });

  const serializedAdmins = serializeData(admins);

  return {
    props: { admins: serializedAdmins },
  };
}
