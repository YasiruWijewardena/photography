// pages/customer/[username]/favourites/photos.js

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import CustomerLayout from '../../../../components/CustomerLayout';
import '../../../../styles/public/customerLayout.css';
import { useEffect, useState } from 'react';
import Masonry from 'react-masonry-css'; // Import Masonry
import PhotoModal from '../../../../components/PhotoModal';
import PhotoCard from '../../../../components/PhotoCard';
import { IconButton } from '@mui/material';
import { CloseRounded } from '@mui/icons-material'; // Corrected import
import PropTypes from 'prop-types';

export default function FavouritedPhotosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { username } = router.query;

  const [favourites, setFavourites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading
    if (!session) {
      router.replace('/login');
    } else if (session.user.role !== 'customer' || session.user.username !== username) {
      router.replace('/login'); // Unauthorized access
    } else {
      fetchAllFavourites();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, router, username]);

  const fetchAllFavourites = async () => {
    try {
      // Fetch all favourites without pagination
      const endpoint = `/api/customer/${username}/favourites/photos`; // Removed ?limit=1000
      const res = await fetch(endpoint);
      if (!res.ok) {
        throw new Error('Failed to fetch favourite photos.');
      }
      const data = await res.json();
      setFavourites(data.photos);
    } catch (err) {
      console.error('Error fetching favourite photos:', err);
      setError(err.message);
    }
  };

  const handleUnfavourite = async (photoId) => {
    try {
      const res = await fetch(`/api/photographs/${photoId}/favourite`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to unfavourite the photo.');
      }
      // Remove the photo from the state
      setFavourites((prev) => prev.filter((photo) => photo.id !== photoId));
    } catch (err) {
      console.error('Error unfavouriting photo:', err);
      setError(err.message);
    }
  };

  // Function to open the modal at a specific index
  const openModalAtIndex = (index) => {
    setCurrentPhotoIndex(index);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPhotoIndex(0); // Reset index if needed
  };

  // Define Masonry breakpoints for responsiveness
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <CustomerLayout username={username}>
      <h1 className="fav-page-title">Your Favourite Photos</h1>
      {error && <p className="error-message">{error}</p>}

      {favourites.length === 0 && (
        <p className="no-album-msg">Your favourite photos will be shown here</p>
      )}

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="masonry-grid"
        columnClassName="masonry-grid_column"
      >
        {favourites.map((photo, index) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onClick={() => openModalAtIndex(index)} // Pass the index here
            isFavouritePage={true}                // Indicate the context
            onUnfavourite={handleUnfavourite}     // Pass the unfavourite handler
          />
        ))}
      </Masonry>

      {/* Modal for Photo Details */}
      {favourites.length > 0 && (
        <PhotoModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          images={favourites}                // Pass the entire list of favourites
          startIndex={currentPhotoIndex}     // Pass the current index
          isFavouritePage={true}             // Indicate the context
          onUnfavourite={handleUnfavourite}  // Pass the unfavourite handler
        />
      )}
    </CustomerLayout>
  );
}

FavouritedPhotosPage.propTypes = {
  // Define prop types if needed
};