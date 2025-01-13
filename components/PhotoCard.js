
// components/PhotoCard.js

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Favorite, FavoriteBorder, Bookmark, BookmarkBorder } from '@mui/icons-material';
import { IconButton, Checkbox } from '@mui/material';
import '../styles/public/home.css'; 
import LoginPromptModal from 'components/LoginPromptModal';
import { usePhotos } from '../context/PhotoContext';
import { motion } from 'framer-motion';

export default function PhotoCard({ photo, onClick, isSelected, onSelect, isEditMode  }) {
  const { data: session, status } = useSession();
  const { toggleLike, toggleFavourite } = usePhotos();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isOwner = session?.user?.username === photo.photographer?.username;

  const handleLike = (e) => {
    e.stopPropagation(); // Prevent triggering the modal
    if (status !== 'authenticated') {
      setIsModalOpen(true);
      return;
    }
    toggleLike(photo.id);
  };

  const handleFavourite = (e) => {
    e.stopPropagation();
    if (status !== 'authenticated') {
      setIsModalOpen(true);
      return;
    }
    toggleFavourite(photo.id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSelect = (e) => {
    onSelect(photo.id);
  };

  return (
    <>
      <motion.div
        className="photoCard-container"
        onClick={onClick}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        whileTap={{ scale: 0.98 }}
      >
       
        <div className="photoCard-imageWrapper">
           {/* Checkbox for selection */}
        {isEditMode && (
          <Checkbox
            checked={isSelected}
            onChange={handleSelect}
            onClick={(e) => e.stopPropagation()} // Prevent card click
            color="primary"
            inputProps={{ 'aria-label': 'Select photo' }}
            className="photo-select-checkbox"
          />
        )}
          <Image
            src={photo.thumbnail_url}
            alt={photo.title}
            width={300}
            height={200}
            layout="responsive"
            objectFit="cover"
            className="photoCard-photoImage"
          />
          <div className="photoCard-overlay">
            <div className="photoCard-photographer">
              <span>{photo.photographer.name}</span>
            </div>
            <div className="photoCard-actions">
              <IconButton
                onClick={handleLike}
                aria-label={photo.isLiked ? 'Unlike photo' : 'Like photo'}
              >
                {photo.isLiked ? <Favorite color="error" /> : <FavoriteBorder className='like-icon'/>}
              </IconButton>
              <span>{photo.likes_count}</span>
              {!(isOwner) && (
                <IconButton
                  onClick={handleFavourite}
                  aria-label={photo.isFavourited ? 'Remove from favourites' : 'Add to favourites'}
                >
                  {photo.isFavourited ? <Bookmark color="primary" /> : <BookmarkBorder className='like-icon'/>}
                </IconButton>
              )}
              
            </div>
          </div>
        </div>
        </motion.div>
      {/* Login Prompt Modal */}
      <LoginPromptModal isOpen={isModalOpen} onRequestClose={closeModal} />
    </>
  );
}
