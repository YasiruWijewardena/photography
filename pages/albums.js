// pages/albums.js

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import '../styles/public/albums.css';
import PublicLayout from '../components/PublicLayout';
import '../styles/public/global.css';
import '../styles/public/home.css';
import PhotoModal from '../components/PhotoModal';
import { usePhotos } from '../context/PhotoContext';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconButton } from '@mui/material';
import { Favorite, FavoriteBorder, Bookmark, BookmarkBorder } from '@mui/icons-material';
import LoginPromptModal from '../components/LoginPromptModal';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import Footer from '../components/Footer';

const albumVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

// Debounce Function
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function AlbumsPage() {
  const { data: session } = useSession();
  const { albums, setAlbumsData, toggleAlbumFavourite } = usePhotos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [currentAlbumId, setCurrentAlbumId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // State for Infinite Scroll
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');

  // Define the limit consistently
  const limit = 5; // You can adjust this as needed

  // Fetch Albums Batch Function
  const fetchAlbumsBatch = async (cursorValue, searchValue) => {
    let url = `/api/public/albums?cursor=${cursorValue || ''}&limit=${limit}`;
    if (searchValue) {
      url += `&search=${encodeURIComponent(searchValue)}`;
    }

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('Failed to fetch albums');
    }
    return await res.json();
  };

  // Initial Fetch on Mount
  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const data = await fetchAlbumsBatch(null, '');
        setAlbumsData(data.albums);
        setNextCursor(data.nextCursor || null);
        setHasMore(!!data.nextCursor);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setAlbumsData([]);
        setHasMore(false);
        setLoading(false);
      }
    })();
  }, [session, setAlbumsData]);

  // Debounced Search Handler
  const debouncedSearch = useRef(
    debounce(async (value) => {
      try {
        // Each time user searches, start from scratch
        setLoading(true);
        const data = await fetchAlbumsBatch(null, value);
        setAlbumsData(data.albums);
        setNextCursor(data.nextCursor || null);
        setHasMore(!!data.nextCursor);
        setLoading(false);
      } catch (error) {
        console.error('Error searching albums:', error);
        setAlbumsData([]);
        setHasMore(false);
        setLoading(false);
      }
    }, 500)
  ).current;

  // Trigger Debounced Search on Search Term Change
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  // Load More Albums Function
  const fetchMoreAlbums = async () => {
    if (!hasMore) return;

    try {
      const data = await fetchAlbumsBatch(nextCursor, searchTerm);

      if (data.albums && Array.isArray(data.albums)) {
        // Append new albums using functional update
        setAlbumsData((prevAlbums) => [...prevAlbums, ...data.albums]);
        setNextCursor(data.nextCursor);
        setHasMore(!!data.nextCursor);
      } else {
        console.error('Invalid albums data:', data);
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
      setHasMore(false);
    }
  };

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

    // Optimistic UI Update
    toggleAlbumFavourite(album.id);

    try {
      const method = album.isFavourited ? 'DELETE' : 'POST';
      const res = await fetch(`/api/users/${album.photographer.username}/albums/${album.slug}/favourite`, {
        method,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to toggle favourite');
      }
    } catch (error) {
      console.error('Error toggling favourite:', error);
      toggleAlbumFavourite(album.id); // Rollback on Error
    }
  };

  return (
    <PublicLayout>
      <div className='albums-page'>
        <h1 className='albums-page-title'>Discover Iconic Albums</h1>

        {/* Search Bar */}
        <div className='albums-filter-options'>
          <div className='album-search-bar'>
            <input
              type='text'
              placeholder='Search Albums...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* InfiniteScroll Component */}
        <InfiniteScroll
          dataLength={albums.length}
          next={fetchMoreAlbums}
          hasMore={hasMore}
          loader={<p className="loader">Loading more albums...</p>}
          endMessage={<p className='infinite-scroll-end-msg'>Thats all folks</p>}
          scrollThreshold={0.9} // Fetch next batch when 90% scrolled
          style={{ overflow: 'visible' }} // Keep normal page scroller
        >
          <div className='public-albums-wrapper'>
            <AnimatePresence>
              {albums.length > 0 ? (
                albums.map((album) => {
                  // Determine if the current user is the owner of the album
                  const isOwner =
                    session?.user?.username === album.photographer?.username;

                  return (
                    <motion.div
                      key={album.id}
                      className='public-album-container'
                      variants={albumVariants}
                      initial='hidden'
                      animate='visible'
                      exit='exit'
                      transition={{ duration: 0.3 }}
                    >
                      {/* Photographer Info */}
                      <div className='album-detail-container'>
                        <div className='photographer-detail-container'>
                          <Link href={`/${album.photographer?.username}`}>
                            <Image
                              src={
                                album.photographer?.profile_picture ||
                                '/default-profile.png'
                              }
                              alt={
                                album.photographer
                                  ? `${album.photographer.name}`
                                  : 'Unknown Photographer'
                              }
                              width={100}
                              height={100}
                              className='photographer-pro-pic'
                            />
                          </Link>

                          <Link href={`/${album.photographer?.username}`}>
                            <h3 className='photographer-name'>
                              {album.photographer
                                ? album.photographer.name
                                : 'Unknown Photographer'}
                            </h3>
                          </Link>
                        </div>

                        {/* Album Details */}
                        <div className='album-details'>
                          <h2>{album.title}</h2>
                          <p>{album.description}</p>
                        </div>

                        {/* Favourite Icon & View Link */}
                        <div className='album-actions-container'>
                          {!isOwner && (
                            <div className='album-favourite-container'>
                              <IconButton
                                onClick={() => handleToggleFavourite(album)}
                                aria-label={
                                  album.isFavourited
                                    ? 'Remove from favourites'
                                    : 'Add to favourites'
                                }
                                className='favourite-btn'
                              >
                                {album.isFavourited ? (
                                  <Bookmark color='black' />
                                ) : (
                                  <BookmarkBorder />
                                )}
                              </IconButton>
                            </div>
                          )}
                          {/* View Album Link */}
                          <Link
                            href={`/${album.photographer?.username}/albums/${album.slug}`}
                            className='album-link'
                          >
                            View album
                          </Link>
                        </div>
                      </div>

                      {/* Image Slider */}
                      {album.photographs.length > 0 && (
                        <Swiper
                          spaceBetween={5}
                          slidesPerView={4}
                          navigation
                          pagination={{ clickable: true }}
                          className='album-slider'
                          breakpoints={{
                            0: {
                              slidesPerView: 1.2,
                            },
                            500: {
                              slidesPerView: 2,
                            },
                            768: {
                              slidesPerView: 3,
                            },
                            980: {
                              slidesPerView: 4,
                            },
                          }}
                   
                        >
                          {album.photographs.map((photo, index) => (
                            <SwiperSlide key={photo.id}>
                              <div
                                className='photo-thumbnail-container'
                                onClick={() => openModal(album.id, index)}
                                style={{ cursor: 'pointer' }}
                                aria-label={`View ${photo.title || 'Photo'}`}
                              >
                                <Image
                                  src={photo.thumbnail_url || '/default-thumbnail.jpg'}
                                  alt={photo.title || 'Album Image'}
                                  layout='fill'
                                  objectFit='cover'
                                  className='album-photo-thumbnail'
                                />
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      )}
                    </motion.div>
                  );
                })
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
        </InfiniteScroll>

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
      <Footer />
    </PublicLayout>
  );
}

AlbumsPage.propTypes = {
  // Define propTypes if necessary
};