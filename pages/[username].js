// [username].js

// import { useRouter } from 'next/router';
// import { useSession, getSession } from 'next-auth/react';
// import PhotographerLayout from '../../components/PhotographerLayout';
// import Dashboard from './dashboard'; // Owner's dashboard
// import PublicProfile from '../../components/PublicProfile'; // Public view
// import prisma from '../../lib/prisma';
// import { useEffect } from 'react';

// export default function PhotographerPage({ photographerData, isOwner }) {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   // Redirect to login if owner is trying to access their dashboard without authentication
//   useEffect(() => {
//     if (isOwner && status !== 'authenticated') {
//       router.push('/login');
//     }
//   }, [isOwner, status, router]);

//   return (
//     <PhotographerLayout isOwner={isOwner} photographerId={photographerData.id}>
//       {isOwner ? (
//         <Dashboard photographerData={photographerData} />
//       ) : (
//         <PublicProfile photographerData={photographerData} />
//       )}
//     </PhotographerLayout>
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
//         User: { select: { firstname: true, lastname: true } },
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

//     const formattedPhotographer = {
//       id: photographer.photo_id,
//       name: `${photographer.User.firstname} ${photographer.User.lastname}`,
//       bio: photographer.bio,
//       website: photographer.website,
//       instagram: photographer.instagram,
//       mobile_num: photographer.mobile_num,
//       profile_picture: photographer.profile_picture,
//       albums: photographer.albums.map((album) => ({
//         id: album.id,
//         title: album.title,
//         description: album.description,
//         cover_photo_url: album.photographs[0]?.thumbnail_url || null,
//       })),
//     };

//     const isOwner =
//       session?.user?.role === 'photographer' &&
//       session.user.id === Number(id);

//     return { props: { photographerData: formattedPhotographer, isOwner } };
//   } catch (error) {
//     console.error('Error fetching photographer profile:', error);
//     return { notFound: true };
//   }
// }

// pages/[username].js

import { useRouter } from 'next/router';
import { useSession, getSession } from 'next-auth/react';
import PhotographerLayout from '../components/PhotographerLayout';
import Dashboard from './photographer/dashboard'; // Adjust the import path as necessary
import PublicProfile from '../components/PublicProfile'; // Adjust the import path as necessary
import prisma from '../lib/prisma';
import { useEffect } from 'react';

export default function PhotographerPage({ photographerData, isOwner }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to login if owner is trying to access their dashboard without authentication
  useEffect(() => {
    if (isOwner && status !== 'authenticated') {
      router.push('/login');
    }
  }, [isOwner, status, router]);

  return (
    <PhotographerLayout isOwner={isOwner} photographerId={photographerData.id} photographerUsername={photographerData.username}>
      {isOwner ? (
        <Dashboard photographerData={photographerData} />
      ) : (
        <PublicProfile photographerData={photographerData} />
      )}
    </PhotographerLayout>
  );
}

export async function getServerSideProps(context) {
  const { username } = context.params;
  const session = await getSession(context);

  // Validate the username
  if (!username || typeof username !== 'string') {
    return { notFound: true };
  }

  try {
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

    const formattedPhotographer = {
      id: photographer.photo_id, // Photographer's unique ID
      name: `${user.firstname} ${user.lastname}`,
      username: user.username, // Ensure username is included
      bio: photographer.bio,
      website: photographer.website,
      instagram: photographer.instagram,
      mobile_num: photographer.mobile_num,
      address: photographer.address,
      profile_picture: photographer.profile_picture,
      is_approved: photographer.is_approved,
      subscription_id: photographer.subscription_id,
      subscription_name: photographer.Subscription?.name || '',
      albums: photographer.albums.map((album) => ({
        id: album.id,
        slug: album.slug,
        title: album.title,
        description: album.description,
        cover_photo_url: album.photographs[0]?.thumbnail_url || null,
      })),
    };

    const isOwner =
      session?.user?.role === 'photographer' &&
      session.user.username === username; // Compare usernames instead of IDs

    return { props: { photographerData: formattedPhotographer, isOwner } };
  } catch (error) {
    console.error('Error fetching photographer profile:', error);
    return { notFound: true };
  }
}