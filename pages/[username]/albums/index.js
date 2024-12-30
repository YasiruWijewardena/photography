// pages/[username]/albums/index.js

import { getSession } from 'next-auth/react';
import PhotographerLayout from '../../../components/PhotographerLayout';
import Link from 'next/link';
import prisma from '../../../lib/prisma';
import PropTypes from 'prop-types';

export default function AlbumsList({ albums, isOwner, photographerUsername }) {
  return (
    <div className="albums-list-page">
      <h1>{isOwner ? 'My Albums' : 'Albums'}</h1>
      <ul className="albums-list">
        {albums.map((album) => (
          <li key={album.id} className="album-item">
            <Link href={`/${photographerUsername}/albums/${album.slug}`} passHref className="album-link">
              
                {album.title}
              
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

AlbumsList.propTypes = {
  albums: PropTypes.array.isRequired,
  isOwner: PropTypes.bool.isRequired,
  photographerUsername: PropTypes.string.isRequired,
};

AlbumsList.getLayout = function getLayout(page) {
  const { albums, isOwner, photographerUsername } = page.props;
  return (
    <PhotographerLayout
      isOwner={isOwner}
      photographerUsername={photographerUsername}
      useAlbumSidebar={true}
      albums={albums || []} // fallback
    >
      {page}
    </PhotographerLayout>
  );
};

export async function getServerSideProps(context) {
  const { username } = context.params;
  const session = await getSession(context);

  if (!username) {
    return { notFound: true };
  }

  // Fetch the photographer based on username
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      Photographer: {
        include: {
          Subscription: true,
          albums: {
            include: {
              photographs: { take: 1, select: { thumbnail_url: true } },
              Category: true,
            },
          },
        },
      },
    },
  });

  if (!user || !user.Photographer) {
    return { notFound: true };
  }

  const photographer = user.Photographer;

  // Determine if the user is the owner
  const isOwner =
    session?.user?.role === 'photographer' &&
    session.user.photographer_id === photographer.id;

  // Fetch the photographer's albums with necessary relations
  const albumsData = await prisma.album.findMany({
    where: { photographer_id: photographer.photo_id },
    include: {
      Category: true,
      photographs: true,
    },
    orderBy: { created_at: 'asc' },
  });

  // Serialize data
  const serializedAlbums = albumsData.map((album) => ({
    ...album,
    created_at: album.created_at.toISOString(),
    updated_at: album.updated_at.toISOString(),
    photographs: album.photographs.map((photo) => ({
      ...photo,
      created_at: photo.created_at.toISOString(),
      updated_at: photo.updated_at.toISOString(),
    })),
  }));

  return {
    props: {
      albums: serializedAlbums,
      isOwner,
      photographerUsername: username, // Pass username
    },
  };
}

AlbumsList.propTypes = {
  albums: PropTypes.array.isRequired,
  isOwner: PropTypes.bool.isRequired,
  photographerUsername: PropTypes.string.isRequired,
};