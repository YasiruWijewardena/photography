// context/PhotoContext.js

import { createContext, useState, useContext, useCallback } from 'react';

// Create the PhotoContext
const PhotoContext = createContext();

// PhotoProvider Component
export function PhotoProvider({ children }) {
  // State to hold the list of global photos
  const [photos, setPhotos] = useState([]);

  // State to hold albums, each containing its photographs
  const [albums, setAlbums] = useState([]);

  // State to manage filters
  const [filters, setFilters] = useState({
    categories: [], // Array of selected category names
    // You can add more filter fields here in the future, e.g., photographers: []
  });

  /**
   * Function to update a single photo in the global photos state.
   * Useful for updating like/favourite status or other photo-specific data.
   *
   * @param {Object} updatedPhoto - The photo object with updated data.
   */
  const updateGlobalPhoto = useCallback((updatedPhoto) => {
    setPhotos((prevPhotos) =>
      prevPhotos.map((photo) => (photo.id === updatedPhoto.id ? updatedPhoto : photo))
    );
  }, []);

  /**
   * Function to update a single photo within a specific album.
   * Ensures that the photo is updated both in the album and the global photos list.
   *
   * @param {number} albumId - The ID of the album containing the photo.
   * @param {Object} updatedPhoto - The photo object with updated data.
   */
  const updateAlbumPhoto = useCallback(
    (albumId, updatedPhoto) => {
      setAlbums((prevAlbums) =>
        prevAlbums.map((album) => {
          if (album.id === albumId) {
            return {
              ...album,
              photographs: album.photographs.map((photo) =>
                photo.id === updatedPhoto.id ? updatedPhoto : photo
              ),
            };
          }
          return album;
        })
      );

      // Also update in global photos
      updateGlobalPhoto(updatedPhoto);
    },
    [updateGlobalPhoto]
  );

  /**
   * Function to toggle the like status of a photo.
   *
   * @param {number} photoId - The ID of the photo to toggle like.
   * @param {number} [albumId] - (Optional) The ID of the album containing the photo.
   */
  const toggleLike = useCallback(
    async (photoId, albumId = null) => {
      // Determine where to find the photo: in albums or global photos
      let photo = null;
      if (albumId !== null) {
        const album = albums.find((a) => a.id === albumId);
        if (album) {
          photo = album.photographs.find((p) => p.id === photoId);
        }
      } else {
        photo = photos.find((p) => p.id === photoId);
      }

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

          if (albumId !== null) {
            updateAlbumPhoto(albumId, updatedPhoto);
          } else {
            updateGlobalPhoto(updatedPhoto);
          }
        } else {
          // Optionally handle errors (e.g., show a notification)
          console.error('Failed to toggle like');
        }
      } catch (error) {
        console.error('Error toggling like:', error);
      }
    },
    [albums, photos, updateAlbumPhoto, updateGlobalPhoto]
  );

  /**
   * Function to toggle the favourite status of a photo.
   *
   * @param {number} photoId - The ID of the photo to toggle favourite.
   * @param {number} [albumId] - (Optional) The ID of the album containing the photo.
   */
  const toggleFavourite = useCallback(
    async (photoId, albumId = null) => {
      // Determine where to find the photo: in albums or global photos
      let photo = null;
      if (albumId !== null) {
        const album = albums.find((a) => a.id === albumId);
        if (album) {
          photo = album.photographs.find((p) => p.id === photoId);
        }
      } else {
        photo = photos.find((p) => p.id === photoId);
      }

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

          if (albumId !== null) {
            updateAlbumPhoto(albumId, updatedPhoto);
          } else {
            updateGlobalPhoto(updatedPhoto);
          }
        } else {
          // Optionally handle errors (e.g., show a notification)
          console.error('Failed to toggle favourite');
        }
      } catch (error) {
        console.error('Error toggling favourite:', error);
      }
    },
    [albums, photos, updateAlbumPhoto, updateGlobalPhoto]
  );

  /**
   * Function to update multiple photos at once.
   * Useful when fetching a new batch of photos based on filters or albums.
   *
   * @param {Array} newPhotos - Array of new photo objects.
   */
  const addPhotos = useCallback(
    (newPhotos) => {
      setPhotos((prevPhotos) => {
        const existingIds = new Set(prevPhotos.map((photo) => photo.id));
        const uniqueNewPhotos = newPhotos.filter((photo) => !existingIds.has(photo.id));
        return [...prevPhotos, ...uniqueNewPhotos];
      });

      // Also update in albums if provided
      newPhotos.forEach((photo) => {
        if (photo.album_id) {
          setAlbums((prevAlbums) =>
            prevAlbums.map((album) => {
              if (album.id === photo.album_id) {
                // Avoid duplicates
                const exists = album.photographs.some((p) => p.id === photo.id);
                if (!exists) {
                  return {
                    ...album,
                    photographs: [...album.photographs, photo],
                  };
                }
              }
              return album;
            })
          );
        }
      });
    },
    []
  );

  /**
   * Function to reset the photos and albums lists.
   * Useful when filters change and you need to fetch a new set of photos/albums.
   */
  const resetPhotos = useCallback(() => {
    setPhotos([]);
    setAlbums([]);
  }, []);

  /**
   * Function to set albums data.
   * Useful for initializing albums fetched from the server.
   *
   * @param {Array} fetchedAlbums - Array of album objects with photographs.
   */
  const setAlbumsData = useCallback(
    (fetchedAlbums) => {
      setAlbums(fetchedAlbums);
      // Also populate global photos
      const allPhotos = fetchedAlbums.flatMap((album) => album.photographs);
      addPhotos(allPhotos);
    },
    [addPhotos]
  );

  return (
    <PhotoContext.Provider
      value={{
        photos,
        setPhotos,
        albums,
        setAlbumsData,
        addPhotos,
        resetPhotos,
        filters,
        setFilters,
        updatePhoto: updateGlobalPhoto, // Retain existing updatePhoto functionality
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