// pages/admin/admins/approve.js

import AdminsPage from '.';
import { getSession } from 'next-auth/react'; // Correct import
import prisma from '../../../lib/prisma';
import AdminLayout from '../../../components/AdminLayout';
import Link from 'next/link';
import { serializeData } from '../../../lib/serialize'; // Import helper function


export default function ApproveAdmins({ admins }) {
  return (
    <AdminsPage>
      <h1 className="text-2xl font-bold mb-4">Approve Admins</h1>
      {admins.length === 0 ? (
        <p>No admins pending approval.</p>
      ) : (
        <ul className='admins-list'>
          {admins.map((admin) => (
            <li key={admin.admin_id} className="admins-list-item">
              <p>
                {admin.User.email}
              </p>
              <Link href={`/admin/admins/${admin.admin_id}`}>
                view
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AdminsPage>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context); // Correct usage

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

  // Fetch admins pending approval
  const admins = await prisma.admin.findMany({
    where: {
      is_approved: false,
      admin_level: 'BASIC', // Only Basic Admins need approval
    },
    include: {
      User: true,
    },
  });

  // Serialize data to handle Date objects
  const serializedAdmins = serializeData(admins);

  return {
    props: {
      admins: serializedAdmins,
    },
  };
}
