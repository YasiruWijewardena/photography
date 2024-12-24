// pages/admin/admins/[id].js

import { getSession } from 'next-auth/react'; // Correct import
import prisma from '../../../lib/prisma';
import AdminLayout from '../../../components/AdminLayout';
import { useRouter } from 'next/router';
import { serializeData } from '../../../lib/serialize'; // Import helper function

export default function AdminDetails({ admin }) {
  const router = useRouter();

  const handleApprove = async () => {
    const res = await fetch(`/api/admin/admins/${admin.admin_id}/approve`, {
      method: 'POST',
    });

    if (res.ok) {
      router.push('/admin/admins/approve');
    } else {
      alert('Failed to approve admin');
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Admin Details</h1>
      <p>
        <strong>Email:</strong> {admin.User.email}
      </p>
      <p>
        <strong>Level:</strong> {admin.admin_level}
      </p>
      {/* Display any other relevant details */}
      <button onClick={handleApprove} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Approve Admin
      </button>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context); // Correct usage
  const { id } = context.params;

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

  const admin = await prisma.admin.findUnique({
    where: {
      admin_id: parseInt(id),
    },
    include: {
      User: true,
    },
  });

  if (!admin) {
    return {
      notFound: true,
    };
  }

  // Serialize data to handle Date objects
  const serializedAdmin = serializeData(admin);

  return {
    props: {
      admin: serializedAdmin,
    },
  };
}
