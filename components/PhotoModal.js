// components/PhotoModal.js

import { useState, useEffect, useRef, useMemo } from 'react';
import Modal from 'react-modal';
import ImageGallery from 'react-image-gallery';
import Image from 'next/image';
import 'react-image-gallery/styles/css/image-gallery.css';
import { motion, AnimatePresence } from 'framer-motion';
import {
  OpenInFullRounded,
  CloseFullscreenRounded,
  CloseRounded,
  Favorite,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder
} from '@mui/icons-material';
import '../styles/public/photoModal.css'; // Ensure this CSS handles modal and gallery styles
import { IconButton } from '@mui/material';
import { usePhotos } from '../context/PhotoContext';
import { useSession } from 'next-auth/react';
import LoginPromptModal from './LoginPromptModal'; // Corrected import path
import Link from 'next/link';
import PropTypes from 'prop-types';

// Set the app element for accessibility
if (typeof window !== 'undefined') {
  Modal.setAppElement('#__next');
}

const modalVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
};

export default function PhotoModal({
  isOpen,
  onRequestClose,
  images = [], // Array of photo objects for galleries
  albumId = null, // Optional: ID of the album for album-specific galleries
  startIndex = 0, // Starting index for galleries
  photo = null, // Single photo object for non-gallery modals
  isFavouritePage = false, // Indicates if used in Favourite Photos page
  onUnfavourite = null, // Handler for unfavouriting
}) {
  const { toggleLike, toggleFavourite, albums } = usePhotos();
  const { data: session, status } = useSession();
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const controlTimeoutRef = useRef(null);
  const modalRef = useRef(null); // Ref for the modal element
  const [isFullscreenSupported, setIsFullscreenSupported] = useState(false);

  const viewedRef = useRef({});



  // Determine the source of images
  let sourceImages = images;
  if (albumId !== null) {
    const album = albums.find(a => a.id === albumId);
    if (album) {
      sourceImages = album.photographs;
    }
  }

  // For single photo modal
  const isSinglePhoto = photo !== null;

  // Update currentIndex only when startIndex changes
  useEffect(() => {
    setCurrentIndex(startIndex);
  }, [startIndex]);

  // Check if Fullscreen API is supported
  useEffect(() => {
    const elem = modalRef.current;
    if (elem) {
      const isSupported = !!(
        elem.requestFullscreen ||
        elem.webkitRequestFullscreen ||
        elem.mozRequestFullScreen ||
        elem.msRequestFullscreen
      );
      setIsFullscreenSupported(isSupported);
    }
  }, [isOpen]);

  // Handle Fullscreen Change Events
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (
        !document.fullscreenElement &&
        !document.webkitFullscreenElement &&
        !document.mozFullScreenElement &&
        !document.msFullscreenElement
      ) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    // Vendor-prefixed events
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Handle Mouse Movement for Control Visibility
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlTimeoutRef.current) {
        clearTimeout(controlTimeoutRef.current);
      }
      controlTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000); // Hide after 3 seconds of inactivity
    };

    if (isOpen) {
      document.addEventListener('mousemove', handleMouseMove);
      // Initialize the timeout
      handleMouseMove();
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      setShowControls(true);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (controlTimeoutRef.current) {
        clearTimeout(controlTimeoutRef.current);
      }
    };
  }, [isOpen]);

  // Fullscreen Toggle Handler
  const openFullscreen = () => {
    const elem = modalRef.current;
    if (!elem) {
      console.error('Modal element not found for fullscreen.');
      return;
    }

    if (!isFullscreen) {
      // Check for standard Fullscreen API
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch((err) => {
          console.error(
            `Error attempting to enable fullscreen mode: ${err.message} (${err.name})`
          );
          alert('Fullscreen mode is not supported on your device.');
        });
      }
      // Vendor-prefixed methods
      else if (elem.webkitRequestFullscreen) { // Safari
        elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
      } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
      } else {
        console.warn('Fullscreen API is not supported in this browser.');
        alert('Fullscreen mode is not supported on your device.');
      }
      setIsFullscreen(true);
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      // Vendor-prefixed methods
      else if (document.webkitExitFullscreen) { // Safari
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
      } else {
        console.warn('Fullscreen API is not supported in this browser.');
      }
      setIsFullscreen(false);
    }
  };

  // Like Handler
  const handleLike = () => {
    if (isSinglePhoto && photo) {
      if (status !== 'authenticated') {
        setIsLoginModalOpen(true);
        return;
      }
      toggleLike(photo.id, albumId); // Pass albumId if available
    } else {
      const currentPhoto = sourceImages[currentIndex];
      if (status !== 'authenticated') {
        setIsLoginModalOpen(true);
        return;
      }
      toggleLike(currentPhoto.id, albumId); // Pass albumId if available
    }
  };

  // Favourite Handler
  const handleFavourite = () => {
    if (isSinglePhoto && photo) {
      if (status !== 'authenticated') {
        setIsLoginModalOpen(true);
        return;
      }
      if (isFavouritePage && onUnfavourite) {
        onUnfavourite(photo.id);
      } else {
        toggleFavourite(photo.id, albumId); // Pass albumId if available
      }
    } else {
      const currentPhoto = sourceImages[currentIndex];
      if (status !== 'authenticated') {
        setIsLoginModalOpen(true);
        return;
      }
      if (isFavouritePage && onUnfavourite) {
        onUnfavourite(currentPhoto.id);
      } else {
        toggleFavourite(currentPhoto.id, albumId); // Pass albumId if available
      }
    }
  };

  // Close Login Modal
  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  //handle view log
  useEffect(() => {
    // On modal open, log the initial photo if not already logged
    if (isOpen && images[startIndex]) {
      const photo = images[startIndex];
      if (!viewedRef.current[photo.id]) {
        viewedRef.current[photo.id] = true;
        recordPhotoView(photo.id);
      }
    }
  }, [isOpen, startIndex, images]);

  // Called whenever the gallery slides to a new index
  const handleSlide = (newIndex) => {
    setCurrentIndex(newIndex);
    const photo = images[newIndex];
    if (!photo) return;

    // If we haven't tracked this photo yet, track it now
    if (!viewedRef.current[photo.id]) {
      viewedRef.current[photo.id] = true;
      recordPhotoView(photo.id);
    }
  };

  // Example function that calls your API route
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

  // Memoize galleryItems to prevent unnecessary re-renders
  const galleryItems = useMemo(() => {
    if (isSinglePhoto && photo) {
      return [{
        original: photo.image_url,
        thumbnail: photo.thumbnail_url,
        title: photo.title,
        description: photo.description,
        photographer: photo.photographer,
        cameraModel: photo.cameraModel,
        lens: photo.lens,
        exposure: photo.exposure,
        focalLength: photo.focalLength,
        isLiked: photo.isLiked,
        isFavourited: photo.isFavourited,
        likes_count: photo.likes_count,
      }];
    }

    return sourceImages.map((photoItem) => ({
      original: photoItem.image_url,
      thumbnail: photoItem.thumbnail_url,
      title: photoItem.title,
      description: photoItem.description,
      photographer: photoItem.photographer,
      cameraModel: photoItem.cameraModel,
      lens: photoItem.lens,
      exposure: photoItem.exposure,
      focalLength: photoItem.focalLength,
      isLiked: photoItem.isLiked,
      isFavourited: photoItem.isFavourited,
      likes_count: photoItem.likes_count,
    }));
  }, [sourceImages, isSinglePhoto, photo]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Photo Carousel"
            className={`carousel-modal-content ${isFullscreen ? 'fullscreen' : ''}`}
            overlayClassName="carousel-modal-overlay"
            closeTimeoutMS={300}
            shouldCloseOnOverlayClick={true}
            style={{
              content: {
                position: 'relative',
                padding: '0',
                border: 'none',
                background: 'none',
                inset: '0', // Fullscreen by default, adjusted by CSS on desktop
              },
              overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                zIndex: 1000,
              },
            }}
          >
            <motion.div
              ref={modalRef} // Attach the ref here
              className={`carousel-modal ${isFullscreen ? 'fullscreen' : ''}`}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {/* Controls Container */}
              <AnimatePresence>
                {showControls && isFullscreenSupported && (
                  <motion.div
                    className="gallery-btn-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <IconButton
                      onClick={openFullscreen}
                      className="fullscreen-toggle-button"
                      aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                    >
                      {isFullscreen ? (
                        <CloseFullscreenRounded className="close-fullscreen-toggle-button" />
                      ) : (
                        <OpenInFullRounded className="open-fullscreen-toggle-button" />
                      )}
                    </IconButton>
                    <IconButton
                      onClick={onRequestClose}
                      className="gallery-close-button-container"
                      aria-label="Close Carousel"
                    >
                      <CloseRounded className="gallery-close-button" />
                    </IconButton>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Image Gallery */}
              <ImageGallery
                items={galleryItems}
                startIndex={currentIndex}
                showThumbnails={false}
                showPlayButton={false}
                showFullscreenButton={false}
                showNav={galleryItems.length > 1} // Conditionally show navigation
                onSlide={handleSlide}
                renderItem={(item) => (
                  <div className={`slider-layout ${isFullscreen ? 'fullscreen' : ''}`}>
                    <div className="slider-image-container">
                      {/* Use standard img tag for compatibility */}
                      <img
                        src={item.original}
                        alt={item.title || 'Untitled Photo'}
                        className="carousel-image"
                        style={{ width: '100%', height: 'auto' }} // Ensure responsive
                      />
                    </div>
                    {!isFullscreen && (
                      <div className="slider-metadata-panel">
                        <div className="slider-photographer-info">
                          <Image
                            src={item.photographer?.profile_picture || '/default-profile.png'}
                            alt={`${item.photographer?.name || 'Unknown Photographer'}'s profile picture`}
                            width={50} // Adjust size as needed
                            height={50} // Adjust size as needed
                            className="photographer-profile-picture"
                          />
                          <Link href={`/${item.photographer?.username}`} className="photographer-name-link">
                            {item.photographer?.name || 'Unknown Photographer'}
                          </Link>
                        </div>
                        {/* Like and Favourite Buttons */}
                        <div className="slider-actions">
                          <IconButton
                            onClick={handleLike}
                            aria-label={item.isLiked ? 'Unlike photo' : 'Like photo'}
                          >
                            {item.isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
                          </IconButton>
                          <span>{item.likes_count}</span>
                          {/* Determine if the user is the owner to hide the Favourite icon */}
                          {!(
                            session?.user?.username === item.photographer?.username
                          ) && (
                            <IconButton
                              onClick={handleFavourite}
                              aria-label={item.isFavourited ? 'Remove from favourites' : 'Add to favourites'}
                            >
                              {item.isFavourited ? <Bookmark color="primary" /> : <BookmarkBorder />}
                            </IconButton>
                          )}
                        </div>
                        {/* Metadata Panel */}
                        {(item.cameraModel || item.lens || item.exposure || item.focalLength) && (
                          <div className="slider-metadata-details">
                            <ul>
                              {item.cameraModel && (
                                <li>
                                  <span>Camera Model:</span> <span>{item.cameraModel}</span>
                                </li>
                              )}
                              {item.lens && (
                                <li>
                                  <span>Lens:</span> <span>{item.lens}</span>
                                </li>
                              )}
                              {item.exposure && (
                                <li>
                                  <span>Exposure:</span> <span>{item.exposure}</span>
                                </li>
                              )}
                              {item.focalLength && (
                                <li>
                                  <span>Focal Length:</span> <span>{item.focalLength}</span>
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              />
            </motion.div>
          </Modal>

          {/* Login Prompt Modal */}
          <LoginPromptModal isOpen={isLoginModalOpen} onRequestClose={closeLoginModal} />
        </>
      )}
    </AnimatePresence>
  );
}

PhotoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  images: PropTypes.array, // Array of photo objects for galleries
  albumId: PropTypes.number, // Optional: ID of the album for album-specific galleries
  startIndex: PropTypes.number,
  photo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    image_url: PropTypes.string.isRequired,
    thumbnail_url: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    cameraModel: PropTypes.string,
    lens: PropTypes.string,
    exposure: PropTypes.string,
    focalLength: PropTypes.string,
    isLiked: PropTypes.bool,
    isFavourited: PropTypes.bool,
    photographer: PropTypes.shape({
      profile_picture: PropTypes.string,
      name: PropTypes.string,
      username: PropTypes.string,
    }),
    likes_count: PropTypes.number,
  }),
  isFavouritePage: PropTypes.bool, // Indicates if used in Favourite Photos page
  onUnfavourite: PropTypes.func,   // Handler for unfavouriting
};

PhotoModal.defaultProps = {
  images: [],
  albumId: null,
  startIndex: 0,
  photo: null,
  isFavouritePage: false,
  onUnfavourite: null,
};