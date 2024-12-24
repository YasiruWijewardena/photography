// context/PhotoContext.js

import { createContext, useState, useContext } from 'react';

// Create the PhotoContext
const PhotoContext = createContext();

// PhotoProvider Component
export function PhotoProvider({ children }) {
  // State to hold the list of photos
  const [photos, setPhotos] = useState([]);

  // State to manage filters
  const [filters, setFilters] = useState({
    categories: [], // Array of selected category names
    // You can add more filter fields here in the future, e.g., photographers: []
  });

  /**
   * Function to update a single photo in the state.
   * Useful for updating like/favourite status or other photo-specific data.
   *
   * @param {Object} updatedPhoto - The photo object with updated data.
   */
  const updatePhoto = (updatedPhoto) => {
    setPhotos((prevPhotos) =>
      prevPhotos.map((photo) => (photo.id === updatedPhoto.id ? updatedPhoto : photo))
    );
  };

  /**
   * Function to toggle the like status of a photo.
   *
   * @param {number} photoId - The ID of the photo to toggle like.
   */
  const toggleLike = async (photoId) => {
    const photo = photos.find((p) => p.id === photoId);
    if (!photo) return;

    try {
      const res = await fetch(`/api/photographs/${photoId}/like`, {
        method: photo.isLiked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin', // Include credentials to send cookies
      });

      if (res.ok) {
        const updatedPhoto = {
          ...photo,
          isLiked: !photo.isLiked,
          likes_count: photo.isLiked ? photo.likes_count - 1 : photo.likes_count + 1,
        };
        updatePhoto(updatedPhoto);
      } else {
        // Optionally handle errors (e.g., show a notification)
        console.error('Failed to toggle like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  /**
   * Function to toggle the favourite status of a photo.
   *
   * @param {number} photoId - The ID of the photo to toggle favourite.
   */
  const toggleFavourite = async (photoId) => {
    const photo = photos.find((p) => p.id === photoId);
    if (!photo) return;

    try {
      const res = await fetch(`/api/photographs/${photoId}/favourite`, {
        method: photo.isFavourited ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin', // Include credentials to send cookies
      });

      if (res.ok) {
        const updatedPhoto = {
          ...photo,
          isFavourited: !photo.isFavourited,
        };
        updatePhoto(updatedPhoto);
      } else {
        // Optionally handle errors (e.g., show a notification)
        console.error('Failed to toggle favourite');
      }
    } catch (error) {
      console.error('Error toggling favourite:', error);
    }
  };

  /**
   * Function to update multiple photos at once.
   * Useful when fetching a new batch of photos based on filters.
   *
   * @param {Array} newPhotos - Array of new photo objects.
   */
  const addPhotos = (newPhotos) => {
    setPhotos((prevPhotos) => {
      const existingIds = new Set(prevPhotos.map((photo) => photo.id));
      const uniqueNewPhotos = newPhotos.filter((photo) => !existingIds.has(photo.id));
      return [...prevPhotos, ...uniqueNewPhotos];
    });
  };

  /**
   * Function to reset the photos list.
   * Useful when filters change and you need to fetch a new set of photos.
   */
  const resetPhotos = () => {
    setPhotos([]);
  };

  return (
    <PhotoContext.Provider
      value={{
        photos,
        setPhotos,
        addPhotos,
        resetPhotos,
        filters,
        setFilters,
        updatePhoto,
        toggleLike,
        toggleFavourite,
      }}
    >
      {children}
    </PhotoContext.Provider>
  );
}

// Custom hook to use the PhotoContext
export function usePhotos() {
  return useContext(PhotoContext);
}
