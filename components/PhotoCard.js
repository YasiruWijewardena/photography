// components/PhotoCard.js

// import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';
// import Image from 'next/image';
// import { Favorite, FavoriteBorder, Bookmark, BookmarkBorder } from '@mui/icons-material';
// import { IconButton } from '@mui/material';
// import '../styles/public/home.css'; 
// import LoginPromptModal from './LoginPromptModal';

// export default function PhotoCard({ photo, onClick }) {
//   const { data: session, status } = useSession();
//   const [isLiked, setIsLiked] = useState(false);
//   const [isFavourited, setIsFavourited] = useState(false);
//   const [likesCount, setLikesCount] = useState(photo.likes_count || 0);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     // Fetch whether the current user has liked or favourited this photo
//     const fetchUserLikeStatus = async () => {
//       if (status === 'authenticated') {
//         try {
//           const res = await fetch(`/api/photographs/${photo.id}/likeStatus`);
//           const data = await res.json();
//           setIsLiked(data.isLiked);
//           setIsFavourited(data.isFavourited);
//         } catch (error) {
//           console.error('Error fetching like status:', error);
//         }
//       } else {
//         setIsLiked(false);
//         setIsFavourited(false);
//       }
//     };

//     fetchUserLikeStatus();
//   }, [photo.id, status]);

//   const handleLike = async () => {
//     if (status !== 'authenticated') {
//       // Open the login prompt modal
//       setIsModalOpen(true);
//       return;
//     }

//     try {
//       const res = await fetch(`/api/photographs/${photo.id}/like`, {
//         method: isLiked ? 'DELETE' : 'POST',
//       });
//       if (res.ok) {
//         setIsLiked(!isLiked);
//         setLikesCount(prev => prev + (isLiked ? -1 : 1));
//       } else if (res.status === 401) {
//         // Unauthorized: open the login prompt modal
//         setIsModalOpen(true);
//       } else {
//         const errorData = await res.json();
//         console.error('Failed to toggle like:', errorData.message);
//         // Optionally, display an error message to the user
//       }
//     } catch (error) {
//       console.error('Error toggling like:', error);
//       // Optionally, display an error message to the user
//     }
//   };

//   const handleFavourite = async () => {
//     if (status !== 'authenticated') {
//       // Open the login prompt modal
//       setIsModalOpen(true);
//       return;
//     }

//     try {
//       const res = await fetch(`/api/photos/${photo.id}/favourite`, {
//         method: isFavourited ? 'DELETE' : 'POST',
//       });
//       if (res.ok) {
//         setIsFavourited(!isFavourited);
//       } else if (res.status === 401) {
//         // Unauthorized: open the login prompt modal
//         setIsModalOpen(true);
//       } else {
//         const errorData = await res.json();
//         console.error('Failed to toggle favourite:', errorData.message);
//         // Optionally, display an error message to the user
//       }
//     } catch (error) {
//       console.error('Error toggling favourite:', error);
//       // Optionally, display an error message to the user
//     }
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <>
//     <div className="photoCard-container" onClick={onClick}>
//       <div className="photoCard-imageWrapper">
//         <Image
//           src={photo.thumbnail_url}
//           alt={photo.title}
//           width={300}
//           height={200}
//           layout="responsive"
//           objectFit="cover"
//           className="photoCard-photoImage"
//         />
//         <div className="photoCard-overlay">
//           <div className="photoCard-photographer">
//             <span>{photo.photographer.name}</span> {/* Adjust based on your data structure */}
//           </div>
//           <div className="photoCard-actions">
//             <IconButton
//               onClick={(e) => {
//                 e.stopPropagation(); // Prevent triggering the modal
//                 handleLike();
//               }}
//               aria-label={isLiked ? 'Unlike photo' : 'Like photo'}
              
//             >
//               {isLiked ? <Favorite color="error" /> : <FavoriteBorder className='like-icon'/>}
//             </IconButton>
//             <span>{likesCount}</span>
//             <IconButton
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleFavourite();
//               }}
//               aria-label={isFavourited ? 'Remove from favourites' : 'Add to favourites'}
//             >
//               {isFavourited ? <Bookmark color="primary" /> : <BookmarkBorder className='like-icon'/>}
//             </IconButton>
//           </div>
//         </div>
//       </div>
      
//     </div>
//     {/* Login Prompt Modal */}
//     <LoginPromptModal isOpen={isModalOpen} onRequestClose={closeModal} />
//     </>
    
//   );
// }

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
              <IconButton
                onClick={handleFavourite}
                aria-label={photo.isFavourited ? 'Remove from favourites' : 'Add to favourites'}
              >
                {photo.isFavourited ? <Bookmark color="primary" /> : <BookmarkBorder className='like-icon'/>}
              </IconButton>
            </div>
          </div>
        </div>
        </motion.div>
      {/* Login Prompt Modal */}
      <LoginPromptModal isOpen={isModalOpen} onRequestClose={closeModal} />
    </>
  );
}
