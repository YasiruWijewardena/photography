// pages/photographer/[id]/profile.js

import { getSession } from 'next-auth/react';
import PhotographerLayout from '../../../components/PhotographerLayout';
import prisma from '../../../lib/prisma'; 
import PropTypes from 'prop-types';

export default function ProfilePage({ photographer, isOwner }) {
  return (
    <div className="profile-page">
      <h1>{photographer.name}'s Profile</h1>
      <p>{photographer.bio}</p>
      {/* Add more profile details as needed */}

      <style jsx>{`
        .profile-page {
          padding: 20px;
        }
        h1 {
          font-size: 2rem;
          margin-bottom: 10px;
        }
        p {
          font-size: 1.2rem;
        }
      `}</style>
    </div>
  );
}

ProfilePage.propTypes = {
  photographer: PropTypes.shape({
    name: PropTypes.string.isRequired,
    bio: PropTypes.string,
  }).isRequired,
  isOwner: PropTypes.bool.isRequired,
};

// This is how we choose which sidebar to use in the Layout
ProfilePage.getLayout = function getLayout(page) {
  const { isOwner, albums } = page.props;
  return (
    <PhotographerLayout
      isOwner={isOwner}
      useAlbumSidebar={!isOwner}  // if not owner => album sidebar
      albums={albums || []}       // fallback empty array
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

  // Fetch the photographer's profile
  const photographer = await prisma.photographer.findUnique({
    where: { id: photographerIdNum },
    select: {
      name: true,
      bio: true,
      // Add any other fields you want to display
    },
  });

  if (!photographer) {
    return { notFound: true };
  }

  // Determine ownership
  const isOwner =
    session?.user?.role === 'photographer' &&
    // If your user object stores the "photographer_id" as session.user.photographer_id:
    session.user.photographer_id === photographerIdNum;

  // Fetch albums for the sidebar (if you want to show them to the non-owner)
  // or always fetch them so the layout won't break
  const albums = await prisma.album.findMany({
    where: { photographer_id: photographerIdNum },
    select: {
      id: true,
      title: true,
    },
  });

  return {
    props: {
      photographer,
      isOwner,
      albums, // pass an array (could be empty if none)
    },
  };
}