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
import prisma from '../../../../lib/prisma';
import AlbumList from '../../../../components/AlbumList'; // Component to display list of albums
import PhotographerLayout from '../../../../components/PhotographerLayout';

export default function AlbumsPage({ albums, photographerId, isOwner }) {
  return (
    <PhotographerLayout isOwner={isOwner} photographerId={photographerId}>
      <div className="albums-page">
        <main>
          <h1>Albums</h1>
          <AlbumList albums={albums} />
        </main>
        <style jsx>{`
          .albums-page {
            display: flex;
          }
          main {
            flex: 1;
            padding: 20px;
            margin-left: 250px; /* Adjust based on sidebar width */
          }
        `}</style>
      </div>
    </PhotographerLayout>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;
  const session = await getSession(context);

  // Validate the ID
  if (!id || isNaN(Number(id))) {
    return { notFound: true };
  }

  try {
    const photographer = await prisma.photographer.findUnique({
      where: { photo_id: Number(id) },
      include: {
        albums: {
          include: {
            photographs: { take: 1, select: { thumbnail_url: true } },
          },
        },
      },
    });

    if (!photographer) {
      return { notFound: true };
    }

    const formattedAlbums = photographer.albums.map((album) => ({
      id: album.id,
      title: album.title,
      description: album.description,
      cover_photo_url: album.photographs[0]?.thumbnail_url || null,
    }));

    const isOwner =
      session?.user?.role === 'photographer' &&
      session.user.id === Number(id);

    return { props: { albums: formattedAlbums, photographerId: Number(id), isOwner } };
  } catch (error) {
    console.error('Error fetching albums:', error);
    return { notFound: true };
  }
}
