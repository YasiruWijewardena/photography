// // pages/photographer/[id]/albums/index.js

// import { getSession } from 'next-auth/react';
// import prisma from '../../../../lib/prisma';
// import AlbumSidebar from '../../../../components/AlbumSidebar';
// import AlbumList from '../../../../components/AlbumList'; // Component to display list of albums

// export default function AlbumsPage({ albums, photographerId, isOwner }) {
//   return (
//     <div className="albums-page">
//       <AlbumSidebar photographerId={photographerId} isOwner={isOwner} />
//       <main>
//         <h1>Albums</h1>
//         <AlbumList albums={albums} />
//       </main>
//       <style jsx>{`
//         .albums-page {
//           display: flex;
//         }
//         main {
//           flex: 1;
//           padding: 20px;
//           margin-left: 250px; /* Adjust based on sidebar width */
//         }
//       `}</style>
//     </div>
//   );
// }

// export async function getServerSideProps(context) {
//   const { id } = context.query;
//   const session = await getSession(context);

//   // Validate the ID
//   if (!id || isNaN(Number(id))) {
//     return { notFound: true };
//   }

//   try {
//     const photographer = await prisma.photographer.findUnique({
//       where: { photo_id: Number(id) },
//       include: {
//         albums: {
//           include: {
//             photographs: { take: 1, select: { thumbnail_url: true } },
//           },
//         },
//       },
//     });

//     if (!photographer) {
//       return { notFound: true };
//     }

//     const formattedAlbums = photographer.albums.map((album) => ({
//       id: album.id,
//       title: album.title,
//       description: album.description,
//       cover_photo_url: album.photographs[0]?.thumbnail_url || null,
//     }));

//     const isOwner =
//       session?.user?.role === 'photographer' &&
//       session.user.id === Number(id);

//     return { props: { albums: formattedAlbums, photographerId: Number(id), isOwner } };
//   } catch (error) {
//     console.error('Error fetching albums:', error);
//     return { notFound: true };
//   }
// }

// pages/photographer/[id]/albums/index.js

import { getSession } from 'next-auth/react';
import PhotographerLayout from '../../../../components/PhotographerLayout';
import Link from 'next/link';
import prisma from '../../../../lib/prisma';

export default function AlbumsList({ albums, isOwner, photographerId }) {
  return (
    <div className="albums-list-page">
      <h1>{isOwner ? 'My Albums' : 'Albums'}</h1>
      <ul className="albums-list">
        {albums.map((album) => (
          <li key={album.id} className="album-item">
            <Link href={`/photographer/${photographerId}/albums/${album.id}`} passHref>
              <button className="album-link">
                {album.title}
              </button>
            </Link>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .albums-list-page {
          padding: 20px;
        }
        .albums-list {
          list-style: none;
          padding: 0;
        }
        .album-item {
          margin-bottom: 10px;
        }
        .album-link {
          background: none;
          border: none;
          color: #3182ce;
          cursor: pointer;
          font-size: 18px;
          text-align: left;
        }
        .album-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

AlbumsList.getLayout = function getLayout(page) {
  const { albums, isOwner, photographerId } = page.props;
  return (
    <PhotographerLayout
      isOwner={isOwner}
      photographerId={photographerId}
      useAlbumSidebar={true}
      albums={albums || []} // fallback
    >
      {page}
    </PhotographerLayout>
  );
};

export async function getServerSideProps(context) {
  const { id } = context.params;
  const session = await getSession(context);

  const photographerIdNum = Number(id);
  if (isNaN(photographerIdNum)) {
    return { notFound: true };
  }

  // Determine if the user is the owner
  let isOwner = false;
  if (
    session &&
    session.user.role === 'photographer' &&
    session.user.photographer_id === photographerIdNum
  ) {
    isOwner = true;
  }

  // Fetch the photographer's albums
  const albums = await prisma.album.findMany({
    where: { photographer_id: photographerIdNum },
    include: {
      photographs: true,
      Photographer: true,
      Category: true,
      tags: true,
      likes: true,
      favourites: true,
    },
  });

  // Serialize data
  const serializedAlbums = albums.map((album) => ({
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
      photographerId: photographerIdNum,
    },
  };
}