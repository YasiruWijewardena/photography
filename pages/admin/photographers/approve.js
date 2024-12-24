// pages/admin/photographers/approve.js

import PhotographersPage from '.';
import { getSession } from 'next-auth/react'; // Correct import
import prisma from '../../../lib/prisma';
import AdminLayout from '../../../components/AdminLayout';
import Link from 'next/link';
import { serializeData } from '../../../lib/serialize'; // Import helper function

export default function ApprovePhotographers({ photographers }) {
  return (
    <PhotographersPage>
      <h1 className="text-2xl font-bold mb-4">Approve Photographers</h1>
      {photographers.length === 0 ? (
        <p>No photographers pending approval.</p>
      ) : (
        <ul className='admins-list'>
          {photographers.map((photographer) => (
            <li key={photographer.photo_id} className="admins-list-item">
              <p>
                <strong>Name:</strong> {photographer.User.username || photographer.User.email}
              </p>
              <p>
                <strong>Email:</strong> {photographer.User.email}
              </p>
              <Link href={`/admin/photographers/${photographer.photo_id}`} className="text-blue-500 hover:underline">
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PhotographersPage>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context); // Correct usage

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

  // Fetch photographers pending approval
  const photographers = await prisma.photographer.findMany({
    where: {
      is_approved: false,
    },
    include: {
      User: true,
    },
  });

  // Serialize data to handle Date objects
  const serializedPhotographers = serializeData(photographers);

  return {
    props: {
      photographers: serializedPhotographers,
    },
  };
}
