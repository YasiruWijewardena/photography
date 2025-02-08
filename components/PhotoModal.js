// components/PhotoModal.js

import { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import { motion, AnimatePresence } from 'framer-motion';
import {
  OpenInFullRounded,
  CloseFullscreenRounded,
  CloseRounded,
  Favorite,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
  ArrowBackIosNew,
  ArrowForwardIos
} from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Link from 'next/link';
import PropTypes from 'prop-types';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

import { usePhotos } from '../context/PhotoContext';
import LoginPromptModal from './LoginPromptModal';
import '../styles/public/photoModal.css';

// For a11y
if (typeof window !== 'undefined') {
  Modal.setAppElement('#__next');
}

/** Framer Motion variants for the normal photo info animation (non-fullscreen). */
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    y: 0,
    opacity: 0,
  }),
  center: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: (direction) => ({
    x: direction < 0 ? 300 : -300,
    y: 0,
    opacity: 0,
    transition: { duration: 0.3 }
  })
};

export default function PhotoModal({
  isOpen,
  onRequestClose,
  images = [],
  albumId = null,
  startIndex = 0,
  photo = null,
  isFavouritePage = false,
  onUnfavourite = null,
}) {
  const { toggleLike, toggleFavourite, albums } = usePhotos();
  const { data: session, status } = useSession();

  // Refs
  const modalRef = useRef(null);
  const viewedRef = useRef({}); // track photo views

  // Photo navigation
  const [page, setPage] = useState(startIndex);
  const [direction, setDirection] = useState(0);

  // Fake fullscreen state only
  const [isFakeFullscreen, setIsFakeFullscreen] = useState(false);

  // Hide controls after inactivity
  const [showControls, setShowControls] = useState(true);

  // If user tries to like/favourite but not logged in
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Gather images
  let sourceImages = images;
  if (albumId !== null) {
    const album = albums.find((a) => a.id === albumId);
    if (album) sourceImages = album.photographs;
  }
  const isSinglePhoto = !!photo;
  const currentPhoto = isSinglePhoto ? photo : sourceImages[page] || null;

  // On modal open, set page
  useEffect(() => {
    setPage(startIndex);
  }, [startIndex]);

  // Hide controls after 3s inactivity
  useEffect(() => {
    let timeoutId;
    const handleMouseMove = () => {
      setShowControls(true);
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setShowControls(true), 3000);
    };
    if (isOpen) {
      document.addEventListener('mousemove', handleMouseMove);
      handleMouseMove();
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      setShowControls(true);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isOpen]);

  // Lock body scroll if in fake fullscreen
  useEffect(() => {
    if (isFakeFullscreen) {
      document.body.classList.add('fake-fullscreen-mode');
    } else {
      document.body.classList.remove('fake-fullscreen-mode');
    }
  }, [isFakeFullscreen]);

  // Track the initial photo’s view
  useEffect(() => {
    if (!isOpen || !currentPhoto) return;
    if (!viewedRef.current[currentPhoto.id]) {
      viewedRef.current[currentPhoto.id] = true;
      recordPhotoView(currentPhoto.id);
    }
  }, [isOpen, currentPhoto]);

  /** 
   * Toggle fake fullscreen mode
   */
  const handleToggleFullscreen = () => {
    setIsFakeFullscreen((prev) => !prev);
  };

  /** 
   * Close modal and disable fake fullscreen to restore body scrolling.
   */
  const handleCloseModal = () => {
    if (isFakeFullscreen) {
      setIsFakeFullscreen(false);
    }
    document.body.classList.remove('fake-fullscreen-mode');
    onRequestClose();
  };

  // Record photo
  const recordPhotoView = async (photoId) => {
    try {
      await fetch('/api/analytics/photo-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoId }),
      });
    } catch (err) {
      console.error('Failed to track photo view:', err);
    }
  };

  // Next / Prev
  const handleNext = () => {
    if (!currentPhoto || isSinglePhoto || !sourceImages.length) return;
    if (page < sourceImages.length - 1) {
      const newPage = page + 1;
      setDirection(1);
      setPage(newPage);
      const nextP = sourceImages[newPage];
      if (nextP && !viewedRef.current[nextP.id]) {
        viewedRef.current[nextP.id] = true;
        recordPhotoView(nextP.id);
      }
    }
  };

  const handlePrev = () => {
    if (!currentPhoto || isSinglePhoto || !sourceImages.length) return;
    if (page > 0) {
      const newPage = page - 1;
      setDirection(-1);
      setPage(newPage);
      const prevP = sourceImages[newPage];
      if (prevP && !viewedRef.current[prevP.id]) {
        viewedRef.current[prevP.id] = true;
        recordPhotoView(prevP.id);
      }
    }
  };

  // Swipe gesture
  const handleDragEnd = (e, info) => {
    const offsetX = info.offset.x;
    const velocityX = info.velocity.x;
    if (offsetX < -100 || velocityX < -500) {
      handleNext();
    } else if (offsetX > 100 || velocityX > 500) {
      handlePrev();
    }
  };

  // Like / Fav
  const handleLike = () => {
    if (!currentPhoto) return;
    if (status !== 'authenticated') {
      setIsLoginModalOpen(true);
      return;
    }
    toggleLike(currentPhoto.id, albumId);
  };

  const handleFavourite = () => {
    if (!currentPhoto) return;
    if (status !== 'authenticated') {
      setIsLoginModalOpen(true);
      return;
    }
    if (isFavouritePage && onUnfavourite) {
      onUnfavourite(currentPhoto.id);
    } else {
      toggleFavourite(currentPhoto.id, albumId);
    }
  };

  const closeLoginModal = () => setIsLoginModalOpen(false);

  // If the modal is closed or no photo
  if (!currentPhoto || !isOpen) return null;

  // Additional classes for fake fullscreen mode
  const modalClasses = [
    'custom-photo-modal-content',
    isFakeFullscreen ? 'fake-fullscreen' : ''
  ].join(' ');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Modal
            isOpen={isOpen}
            onRequestClose={handleCloseModal}
            className={modalClasses}
            overlayClassName="custom-photo-modal-overlay"
            closeTimeoutMS={300}
            shouldCloseOnOverlayClick={true}
            style={{
              content: {
                position: 'relative',
                padding: 0,
                border: 'none',
                background: 'none',
                inset: 0
              },
              overlay: {
                backgroundColor: 'rgba(0, 0, 0)',
                zIndex: 3000
              }
            }}
          >
            <motion.div
              ref={modalRef}
              className="custom-photo-modal"
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {/* 
                -- TOP CONTROLS (Fake Fullscreen toggle, Close) 
                Always show them (with hide after 3s inactivity).
              */}
              <AnimatePresence>
                {showControls && (
                  <motion.div
                    className="top-controls-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Fake fullscreen toggle button */}
                    <IconButton
                      onClick={handleToggleFullscreen}
                      className="fullscreen-toggle-button"
                      aria-label={isFakeFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                    >
                      {isFakeFullscreen ? <CloseFullscreenRounded /> : <OpenInFullRounded />}
                    </IconButton>

                    {/* Close (always) - calls handleCloseModal */}
                    <IconButton
                      onClick={handleCloseModal}
                      className="photomodal-close-button"
                      aria-label="Close"
                    >
                      <CloseRounded />
                    </IconButton>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 
                -- FAKE FULLSCREEN MODE => Only show image + arrows 
                (metadata hidden)
              */}
              {isFakeFullscreen ? (
                <motion.div
                  key={currentPhoto.id + '-fullscreen'}
                  className="fullscreen-image-container"
                >
                  <motion.img
                    key={currentPhoto.id + '-fullscreen-img'}
                    src={currentPhoto.image_url}
                    alt={currentPhoto.title || 'Photo'}
                    className="fullscreen-image"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={handleDragEnd}
                  />

                  {/* Navigation Arrows in fake fullscreen */}
                  {(!isSinglePhoto && sourceImages.length > 1) && (
                    <>
                      <IconButton
                        onClick={handlePrev}
                        className="nav-arrow left-arrow"
                        disabled={page === 0}
                      >
                        <ArrowBackIosNew />
                      </IconButton>

                      <IconButton
                        onClick={handleNext}
                        className="nav-arrow right-arrow"
                        disabled={page === sourceImages.length - 1}
                      >
                        <ArrowForwardIos />
                      </IconButton>
                    </>
                  )}
                </motion.div>
              ) : (
                /* -- NORMAL MODE => show image, metadata panel, arrows */
                <div className="modal-content-layout">
                  <div className="image-and-metadata-container">
                    <div className="motion-image-wrapper">
                      <AnimatePresence custom={direction} mode="popLayout">
                        <motion.div
                          key={currentPhoto.id + '-image'}
                          className="image-container"
                          variants={slideVariants}
                          custom={direction}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          drag="x"
                          dragConstraints={{ left: 0, right: 0 }}
                          onDragEnd={handleDragEnd}
                        >
                          <img
                            src={currentPhoto.image_url}
                            alt={currentPhoto.title || 'Photo'}
                            className="main-photo"
                          />
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Arrows + metadata panel */}
                    <div className="metadata-and-arrows">
                      {(!isSinglePhoto && sourceImages.length > 1) && (
                        <IconButton
                          onClick={handlePrev}
                          className="nav-arrow left-arrow"
                          disabled={page === 0}
                        >
                          <ArrowBackIosNew />
                        </IconButton>
                      )}

                      <div className="metadata-panel">
                        <div className="metadata-panel-inner">
                          {currentPhoto.photographer && (
                            <div
                              key={currentPhoto.id + '-photographer'}
                              className="photographer-info"
                            >
                              <Image
                                src={
                                  currentPhoto.photographer.profile_picture ||
                                  '/default-profile.png'
                                }
                                alt={
                                  currentPhoto.photographer.name || 'Unknown'
                                }
                                width={50}
                                height={50}
                                className="photographer-profile-picture"
                              />
                              <Link
                                href={`/${currentPhoto.photographer.username || ''}`}
                                className="photographer-name-link"
                              >
                                {currentPhoto.photographer.name ||
                                  'Unknown Photographer'}
                              </Link>
                            </div>
                          )}

                          <div
                            key={currentPhoto.id + '-actions'}
                            className="action-buttons"
                          >
                            <IconButton
                              onClick={handleLike}
                              aria-label={
                                currentPhoto.isLiked
                                  ? 'Unlike photo'
                                  : 'Like photo'
                              }
                            >
                              {currentPhoto.isLiked ? (
                                <Favorite color="error" />
                              ) : (
                                <FavoriteBorder />
                              )}
                            </IconButton>

                            <span className="like-count">
                              {currentPhoto.likes_count || 0}
                            </span>

                            {session?.user?.username !==
                              currentPhoto.photographer?.username && (
                              <IconButton
                                onClick={handleFavourite}
                                aria-label={
                                  currentPhoto.isFavourited
                                    ? 'Remove from favourites'
                                    : 'Add to favourites'
                                }
                              >
                                {currentPhoto.isFavourited ? (
                                  <Bookmark color="primary" />
                                ) : (
                                  <BookmarkBorder />
                                )}
                              </IconButton>
                            )}
                          </div>
                        </div>
                      </div>

                      {(!isSinglePhoto && sourceImages.length > 1) && (
                        <IconButton
                          onClick={handleNext}
                          className="nav-arrow right-arrow"
                          disabled={page === sourceImages.length - 1}
                        >
                          <ArrowForwardIos />
                        </IconButton>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </Modal>

          {/* If user tries to like/fav but not logged in */}
          <LoginPromptModal
            isOpen={isLoginModalOpen}
            onRequestClose={closeLoginModal}
          />
        </>
      )}
    </AnimatePresence>
  );
}

PhotoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  images: PropTypes.array,
  albumId: PropTypes.number,
  startIndex: PropTypes.number,
  photo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    image_url: PropTypes.string.isRequired,
    title: PropTypes.string,
    photographer: PropTypes.shape({
      profile_picture: PropTypes.string,
      name: PropTypes.string,
      username: PropTypes.string,
    }),
    likes_count: PropTypes.number,
    isLiked: PropTypes.bool,
    isFavourited: PropTypes.bool,
  }),
  isFavouritePage: PropTypes.bool,
  onUnfavourite: PropTypes.func,
};

PhotoModal.defaultProps = {
  images: [],
  albumId: null,
  startIndex: 0,
  photo: null,
  isFavouritePage: false,
  onUnfavourite: null,
};