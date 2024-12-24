import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma';
import AdminLayout from '../../../../components/AdminLayout';
import { useRouter } from 'next/router';
import { serializeData } from '../../../../lib/serialize';

export default function PhotographerManage({ photographer }) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete this photographer? This action cannot be undone.');
    if (confirmed) {
      const res = await fetch(`/api/admin/photographers/${photographer.photo_id}/delete`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Photographer deleted successfully.');
        router.push('/admin/photographers/manage');
      } else {
        alert('Failed to delete photographer.');
      }
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Manage Photographer</h1>
      <div className="mb-4">
        <p>
          <strong>Name:</strong> {photographer.User.username || photographer.User.email}
        </p>
        <p>
          <strong>Email:</strong> {photographer.User.email}
        </p>
      </div>
      <h2 className="text-xl font-semibold mb-2">Albums</h2>
      {photographer.albums.length === 0 ? (
        <p>No albums found for this photographer.</p>
      ) : (
        <ul className="list-disc list-inside">
          {photographer.albums.map((album) => (
            <li key={album.id}>{album.title}</li>
          ))}
        </ul>
      )}
      <button
        onClick={handleDelete}
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Delete Photographer
      </button>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const { photo_id } = context.params;

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

  const photographer = await prisma.photographer.findUnique({
    where: { photo_id: parseInt(photo_id) },
    include: { User: true, albums: true },
  });

  if (!photographer) {
    return { notFound: true };
  }

  const serializedPhotographer = serializeData(photographer);

  return {
    props: { photographer: serializedPhotographer },
  };
}
