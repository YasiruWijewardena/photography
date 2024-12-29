// components/PhotoModal.js

import { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import ImageGallery from 'react-image-gallery';
import Image from 'next/image'; // Correct Import
import 'react-image-gallery/styles/css/image-gallery.css';
import { motion, AnimatePresence } from 'framer-motion';
import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
import CloseFullscreenRoundedIcon from '@mui/icons-material/CloseFullscreenRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import '../styles/public/photoModal.css';
import { IconButton } from '@mui/material';
import { Favorite, FavoriteBorder, Bookmark, BookmarkBorder } from '@mui/icons-material';
import { usePhotos } from '../context/PhotoContext';
import { useSession } from 'next-auth/react';
import LoginPromptModal from '/components/LoginPromptModal';
import Link from 'next/link'; 

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
  images, // Array of photo objects
  startIndex = 0,
}) {
  const { toggleLike, toggleFavourite } = usePhotos();
  const { data: session, status } = useSession();
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const controlTimeoutRef = useRef(null);

  useEffect(() => {
    setCurrentIndex(startIndex);
  }, [startIndex]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

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

  const openFullscreen = () => {
    const elem = document.getElementById('photo-modal');
    if (!isFullscreen) {
      elem.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable fullscreen mode: ${err.message} (${err.name})`
        );
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleLike = () => {
    const currentPhoto = images[currentIndex];
    if (status !== 'authenticated') {
      setIsLoginModalOpen(true);
      return;
    }
    toggleLike(currentPhoto.id);
  };

  const handleFavourite = () => {
    const currentPhoto = images[currentIndex];
    if (status !== 'authenticated') {
      setIsLoginModalOpen(true);
      return;
    }
    toggleFavourite(currentPhoto.id);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  // Map your photo objects to ImageGallery's expected format
  const galleryItems = images.map((photo) => ({
    original: photo.image_url,
    thumbnail: photo.thumbnail_url,
    title: photo.title,
    metadata: {
      cameraModel: photo.cameraModel,
      lens: photo.lens,
      exposure: photo.exposure,
      focalLength: photo.focalLength,
    },
    photographer: photo.photographer, // Include photographer info
    isLiked: photo.isLiked,
    isFavourited: photo.isFavourited,
    likes_count: photo.likes_count,
  }));

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
            id="photo-modal"
          >
            <motion.div
              className={`carousel-modal ${isFullscreen ? 'fullscreen' : ''}`}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {/* Controls Container */}
              <AnimatePresence>
                {showControls && (
                  <motion.div
                    className="gallery-btn-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button
                      onClick={openFullscreen}
                      className="fullscreen-toggle-button"
                      aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                    >
                      {isFullscreen ? (
                        <CloseFullscreenRoundedIcon className="close-fullscreen-toggle-button" />
                      ) : (
                        <OpenInFullRoundedIcon className="open-fullscreen-toggle-button" />
                      )}
                    </button>
                    <button
                      onClick={onRequestClose}
                      className="gallery-close-button-container"
                      aria-label="Close Carousel"
                    >
                      <CloseRoundedIcon className="gallery-close-button" />
                    </button>
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
                showNav={true}
                onSlide={(current) => setCurrentIndex(current)}
                renderItem={(item) => (
                  <div className={`slider-layout ${isFullscreen ? 'fullscreen' : ''}`}>
                    <div className="slider-image-container">
                      {/* Use Next.js Image component */}
                      <Image
                        src={item.original}
                        alt={item.title}
                        width={800} // Adjust based on your design
                        height={600} // Adjust based on your design
                        layout="responsive"
                        objectFit="contain"
                        className="carousel-image"
                      />
                    </div>
                    {!isFullscreen && (
                      <div className="slider-metadata-panel">
                      <div className="slider-photographer-info">
                        <Image
                          src={item.photographer.profile_picture}
                          alt={`${item.photographer.name}'s profile picture`}
                          width={100} // Adjust size as needed
                          height={100} // Adjust size as needed
                          className="photographer-profile-picture"
                        />
                        <Link href={`/photographer/${item.photographer.id}`} className="photographer-name-link">
                            
                              {item.photographer.name}
                            
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
                        <IconButton
                          onClick={handleFavourite}
                          aria-label={item.isFavourited ? 'Remove from favourites' : 'Add to favourites'}
                        >
                          {item.isFavourited ? <Bookmark color="primary" /> : <BookmarkBorder />}
                        </IconButton>
                      </div>
                      {/* Metadata Panel */}
                      { item.metadata && (
                        <div className="slider-metadata-details">
                          <ul>
                            {item.metadata.cameraModel && (
                              <li>
                                <span>Camera Model:</span> <span>{item.metadata.cameraModel}</span>
                              </li>
                            )}
                            {item.metadata.lens && (
                              <li>
                                <span>Lens:</span> <span>{item.metadata.lens}</span>
                              </li>
                            )}
                            {item.metadata.exposure && (
                              <li>
                                <span>Exposure:</span> <span>{item.metadata.exposure}</span>
                              </li>
                            )}
                            {item.metadata.focalLength && (
                              <li>
                                <span>Focal Length:</span> <span>{item.metadata.focalLength}</span>
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
