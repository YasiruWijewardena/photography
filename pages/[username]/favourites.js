// pages/[username]/favourites.js

import { getSession } from 'next-auth/react';
import PhotographerLayout from '../../components/PhotographerLayout';
import PhotographerFavouritedAlbums from '../../components/PhotographerFavouritedAlbums';
import PropTypes from 'prop-types';
import PublicLayout from '../../components/PublicLayout';
import prisma from '../../lib/prisma'; // Adjust the path based on your project structure
import '../../styles/public/favAlbumsLayout.css';

export default function PhotographerFavourites({ photographerData, isOwner }) {
  return (
    <PublicLayout>
      <PhotographerLayout
        isOwner={isOwner}
        photographerId={photographerData.id}
        photographerUsername={photographerData.username}
        albums={photographerData.albums}
      >
        <PhotographerFavouritedAlbums username={photographerData.username} />
      </PhotographerLayout>
    </PublicLayout>
  );
}

PhotographerFavourites.propTypes = {
  photographerData: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    albums: PropTypes.array,
  }).isRequired,
  isOwner: PropTypes.bool.isRequired,
};

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

    // Redirect to login if not authenticated or not the owner
    if (!session || session.user.role !== 'photographer' || session.user.username !== username) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    return { props: { photographerData: formattedPhotographer, isOwner } };
  } catch (error) {
    console.error('Error fetching photographer profile:', error);
    return { notFound: true };
  }
}