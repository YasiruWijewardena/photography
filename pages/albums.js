// pages/albums.js

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import '../styles/public/albums.css';
import PublicLayout from '../components/PublicLayout';
import '../styles/public/global.css';
import '../styles/public/home.css';
import PhotoModal from '../components/PhotoModal'; // Import PhotoModal
import { usePhotos } from '../context/PhotoContext'; // Import usePhotos
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

// Define animation variants
const albumVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export default function AlbumsPage() {
  const { data: session, status } = useSession();
  const { albums, setAlbumsData } = usePhotos(); // Consume albums from context
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [currentAlbumId, setCurrentAlbumId] = useState(null); // New state to track current album
  const [loading, setLoading] = useState(true);

  // Fetch albums and set them in PhotoContext
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await fetch('/api/public/albums');
        if (!res.ok) {
          console.error('Failed to fetch albums');
          setAlbumsData([]);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setAlbumsData(data.albums);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching albums:', error);
        setAlbumsData([]);
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [session, setAlbumsData]); // Re-fetch when session changes

  // Handler to open modal with specific album photos
  const openModal = (albumId, index) => {
    setCurrentAlbumId(albumId);
    setCurrentPhotoIndex(index);
    setIsModalOpen(true);
  };

  // Handler to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentAlbumId(null);
    setCurrentPhotoIndex(0);
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className='albums-page'>
          <h1 className='albums-page-title'>Discover Albums</h1>
          <p>Loading albums...</p>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className='albums-page'>
        <h1 className='albums-page-title'>Discover Albums</h1>
        <div className='public-albums-wrapper'>
          <AnimatePresence>
            {albums.length > 0 ? (
              albums.map((album) => (
                <motion.div
                  key={album.id}
                  className='public-album-container'
                  variants={albumVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  {/* Photographer Info */}
                  <div className='album-detail-container'>
                    <div className='photographer-detail-container'> 
                      <Image
                        src={album.photographer?.profile_picture || '/default-profile.png'}
                        alt={album.photographer
                          ? `${album.photographer.name}`
                          : 'Unknown Photographer'}
                        width={100}
                        height={100}
                        className='photographer-pro-pic'
                      />
                      <h3>
                        {album.photographer ? album.photographer.name : 'Unknown Photographer'}
                      </h3>
                    </div>
                    
                    {/* Album Details */}
                    <div className='album-details'>
                      <h2>{album.title}</h2>
                      <p>{album.description}</p>
                    </div>

                    {/* View Album Link */}
                    <Link href={`/${album.photographer?.username}/albums/${album.slug}`} passHref className='album-link'>
                      View in profile
                    </Link>
                  </div>

                  {/* Image Slider */}
                  {album.photographs.length > 0 && (
                    <Swiper
                      spaceBetween={10}
                      slidesPerView={4}
                      navigation
                      pagination={{ clickable: true }}
                      className='album-slider'
                    >
                      {album.photographs.map((photo, index) => (
                        <SwiperSlide key={photo.id}>
                          <div 
                            className='photo-thumbnail-container'
                            onClick={() => openModal(album.id, index)} // Pass album.id instead of images
                            style={{ cursor: 'pointer' }}
                            aria-label={`View ${photo.title || 'Photo'}`}
                          >
                            <Image
                              src={photo.thumbnail_url || '/default-thumbnail.jpg'}
                              alt={photo.title || 'Album Image'}
                              layout="fill"
                              objectFit="cover"
                              className='album-photo-thumbnail'
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </motion.div>
              ))
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                No albums available.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Photo Modal */}
        {currentAlbumId && (
          <PhotoModal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            albumId={currentAlbumId} // Pass albumId instead of images
            startIndex={currentPhotoIndex}
          />
        )}
      </div>
    </PublicLayout>
  );
}

AlbumsPage.propTypes = {
  // Define propTypes if necessary
};