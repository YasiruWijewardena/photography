import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma';
import AdminLayout from '../../../../components/AdminLayout';
import { useRouter } from 'next/router';
import { serializeData } from '../../../../lib/serialize';

export default function AdminManage({ admin }) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete this admin? This action cannot be undone.');
    if (confirmed) {
      const res = await fetch(`/api/admin/admins/${admin.admin_id}/delete`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Admin deleted successfully.');
        router.push('/admin/admins/manage');
      } else {
        alert('Failed to delete admin.');
      }
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Manage Admin</h1>
      <div className="mb-4">
        <p>
          <strong>Email:</strong> {admin.User.email}
        </p>
        <p>
          <strong>Level:</strong> {admin.admin_level}
        </p>
      </div>
      <button
        onClick={handleDelete}
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Delete Admin
      </button>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const { admin_id } = context.params;

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
    where: { admin_id: parseInt(admin_id) },
    include: { User: true },
  });

  if (!admin) {
    return { notFound: true };
  }

  const serializedAdmin = serializeData(admin);

  return {
    props: { admin: serializedAdmin },
  };
}
