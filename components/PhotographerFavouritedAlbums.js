// components/PhotographerFavouritedAlbums.js

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import '../styles/public/albumsLayout.css';
import '../styles/public/global.css';
import '../styles/public/home.css';
import PhotoModal from './PhotoModal';
import { usePhotos } from '../context/PhotoContext';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconButton } from '@mui/material';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';
import LoginPromptModal from './LoginPromptModal';
import PropTypes from 'prop-types';

// Animation Variants
const albumVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export default function PhotographerFavouritedAlbums({ username }) {
  const { data: session } = useSession();
  const { albums, setAlbumsData, toggleAlbumFavourite } = usePhotos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [currentAlbumId, setCurrentAlbumId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Favourited Albums on Mount
  useEffect(() => {
    const fetchAlbums = async () => {
      if (!username) {
        console.error('Username is undefined. Cannot fetch favourites.');
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/photographer/${username}/favourites`);
        if (!res.ok) throw new Error('Failed to fetch favourited albums');
        const data = await res.json();
        setAlbumsData(data.favourites);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setAlbumsData([]);
        setLoading(false);
      }
    };

    if (username) { // Ensure username is defined
      fetchAlbums();
    }
  }, [session, setAlbumsData, username]);

  // Modal Handlers
  const openModal = (albumId, index) => {
    setCurrentAlbumId(albumId);
    setCurrentPhotoIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentAlbumId(null);
    setCurrentPhotoIndex(0);
  };

  // Toggle Favourite Handler
  const handleToggleFavourite = async (album) => {
    if (!session) {
      setIsLoginModalOpen(true);
      return;
    }

    toggleAlbumFavourite(album.id); // Optimistic UI Update

    try {
      const method = album.isFavourited ? 'DELETE' : 'POST';
      // **Use the album's photographer's username instead of the current username**
      const photographerUsername = album.photographer.username;

      const res = await fetch(`/api/photographer/${photographerUsername}/albums/${album.slug}/favourite`, {
        method,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to toggle favourite');
      }

      // Optionally, refetch favourites to ensure consistency
      const updatedRes = await fetch(`/api/photographer/${username}/favourites`);
      if (updatedRes.ok) {
        const updatedData = await updatedRes.json();
        setAlbumsData(updatedData.favourites);
      }

    } catch (error) {
      console.error('Error toggling favourite:', error);
      toggleAlbumFavourite(album.id); // Rollback on error
    }
  };

  return (
    <div className="albums-page">
      <h1 className="albums-page-title">Your Favourite Albums</h1>

      {/* Albums List */}
      <div className="public-albums-wrapper">
        <AnimatePresence>
          {albums.length > 0 ? (
            albums
              .filter((album) =>
                album.title.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((album) => (
                <motion.div
                  key={album.id}
                  className="public-album-container"
                  variants={albumVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  {/* Photographer Info */}
                  <div className="album-detail-container">
                    <div className="photographer-detail-container">
                      <Link href={`/${album.photographer?.username}`} className="photographer-name">
                        <Image
                          src={album.photographer?.profile_picture || '/default-profile.png'}
                          alt={album.photographer ? `${album.photographer.name}` : 'Unknown Photographer'}
                          width={100}
                          height={100}
                          className="photographer-pro-pic"
                        />
                      </Link>

                      <Link href={`/${album.photographer?.username}`} className="photographer-name">
                        {album.photographer ? album.photographer.name : 'Unknown Photographer'}
                      </Link>
                    </div>

                    {/* Album Details */}
                    <div className="album-details">
                      <h2>{album.title}</h2>
                      <p>{album.description}</p>
                    </div>

                    {/* Favourite Icon & View Link */}
                    <div className="album-actions-container">
                      <div className="album-favourite-container">
                        <IconButton
                          onClick={() => handleToggleFavourite(album)}
                          aria-label={
                            album.isFavourited
                              ? 'Remove from favourites'
                              : 'Add to favourites'
                          }
                          className="favourite-btn"
                        >
                          {album.isFavourited ? <Bookmark color="black" /> : <BookmarkBorder />}
                        </IconButton>
                      </div>
                      {/* View Album Link */}
                      <Link
                        href={`/${album.photographer?.username}/albums/${album.slug}`}
                        className="album-link"
                      >
                        View album
                      </Link>
                    </div>
                  </div>

                  {/* Image Slider */}
                  {album.photographs.length > 0 && (
                    <div className="swiper-container">
                      <Swiper
                        spaceBetween={10}
                        slidesPerView={4}
                        navigation
                        pagination={{ clickable: true }}
                        className="album-slider"
                      >
                        {album.photographs.map((photo, index) => (
                          <SwiperSlide key={photo.id}>
                            <div
                              className="photo-thumbnail-container"
                              onClick={() => openModal(album.id, index)}
                              style={{ cursor: 'pointer' }}
                            >
                              <Image
                                src={photo.thumbnail_url || '/default-thumbnail.jpg'}
                                alt={photo.title || 'Album Image'}
                                layout="fill"
                                objectFit="cover"
                                className="album-photo-thumbnail"
                              />
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  )}
                </motion.div>
              ))
          ) : (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='no-album-msg'>
              Your favourite albums will be shown here
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Photo Modal */}
      {currentAlbumId && (
        <PhotoModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          albumId={currentAlbumId}
          startIndex={currentPhotoIndex}
        />
      )}

      {/* Login Prompt Modal */}
      <LoginPromptModal
        isOpen={isLoginModalOpen}
        onRequestClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}

PhotographerFavouritedAlbums.propTypes = {
  username: PropTypes.string.isRequired,
};