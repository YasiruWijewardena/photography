// pages/admin/photographers/manage.js

import PhotographersPage from '.';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';
import AdminLayout from '../../../components/AdminLayout';
import Link from 'next/link';
import { serializeData } from '../../../lib/serialize';

export default function ManagePhotographers({ photographers }) {
  return (
    <PhotographersPage>
      <h1 className="text-2xl font-bold mb-4">Manage Photographers</h1>
      {photographers.length === 0 ? (
        <p>No approved photographers found.</p>
      ) : (
        <div className="admins-list">
          {photographers.map((photographer) => (
            <Link
              href={`/admin/photographers/manage/${photographer.photo_id}`}
              key={photographer.photo_id}
              className="admins-list-item"
            >
              <p className="font-semibold text-lg">
                {photographer.User.username || photographer.User.email}
              </p>
              <p className="text-sm text-gray-300">{photographer.User.email}</p>
            </Link>
          ))}
        </div>
      )}
    </PhotographersPage>
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

  const photographers = await prisma.photographer.findMany({
    where: { is_approved: true },
    include: { User: true },
  });

  const serializedPhotographers = serializeData(photographers);

  return {
    props: { photographers: serializedPhotographers },
  };
}
