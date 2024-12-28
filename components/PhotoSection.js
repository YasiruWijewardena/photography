// components/PhotoSection.js

// import { useEffect, useState, useRef } from 'react';
// import InfiniteScroll from 'react-infinite-scroll-component';
// import Masonry from 'react-masonry-css';
// import PhotoModal from './PhotoModal'; // Adjust the import path as necessary
// import '../styles/public/home.css';
// import PhotoCard from './PhotoCard';
// import { usePhotos } from '../context/PhotoContext';
// import Filter from './Filter'; // Import the Filter component
// import { Box, IconButton, Collapse } from '@mui/material';
// import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded'; // Import the FilterList icon

// export default function PhotoSection() {
//   const { photos, addPhotos, resetPhotos, filters, toggleLike, toggleFavourite } = usePhotos();
//   const [hasMore, setHasMore] = useState(true);
//   const [nextCursor, setNextCursor] = useState(null);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

//   const [isFilterOpen, setIsFilterOpen] = useState(false); // State to manage filter panel visibility
//   const filterRef = useRef(null); // Ref for filter panel

//   const breakpointColumnsObj = {
//     default: 4,
//     1100: 3,
//     700: 2,
//     500: 1,
//   };

//   const fetchPhotos = async () => {
//     try {
//       const categoriesQuery = filters.categories.length > 0 ? `&categories=${filters.categories.join(',')}` : '';
//       const res = await fetch(`/api/random-photos?cursor=${nextCursor || ''}&limit=20${categoriesQuery}`);
//       const data = await res.json();
//       console.log('Fetched Photos:', data);
//       if (data.nextCursor) {
//         setNextCursor(data.nextCursor);
//       } else {
//         setHasMore(false);
//       }
//       addPhotos(data.photos);
//     } catch (error) {
//       console.error('Error fetching photos:', error);
//     }
//   };

//   // Fetch photos when component mounts or filters change
//   useEffect(() => {
//     // Reset photos and pagination when filters change
//     const resetAndFetch = async () => {
//       resetPhotos();
//       setNextCursor(null);
//       setHasMore(true);
//       await fetchPhotos();
//     };
//     resetAndFetch();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filters]);

//   // Shift focus to filter panel when it opens
//   useEffect(() => {
//     if (isFilterOpen && filterRef.current) {
//       // Shift focus to the first checkbox in the filter panel
//       const firstCheckbox = filterRef.current.querySelector('input[type="checkbox"]');
//       if (firstCheckbox) {
//         firstCheckbox.focus();
//       }
//     }
//   }, [isFilterOpen]);

//   const openModalAtIndex = (index) => {
//     setCurrentPhotoIndex(index);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <section className="photoSection">
//       {/* Filter Toggle Button */}
//       <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
//         <IconButton
//           onClick={() => setIsFilterOpen(prev => !prev)}
//           aria-label="Toggle filter options"
//           color="primary"
//           aria-expanded={isFilterOpen}
//           aria-controls="filter-panel"
//         >
//           <FilterAltRoundedIcon className="icon" />
//         </IconButton>
//       </Box>

//       {/* Collapsible Filter Panel */}
//       <Collapse in={isFilterOpen} id="filter-panel">
//         <Box sx={{ marginBottom: 2 }} ref={filterRef}>
//           <Filter />
//         </Box>
//       </Collapse>

//       {/* Infinite Scroll and Masonry Grid */}
//       <InfiniteScroll
//         dataLength={photos.length}
//         next={fetchPhotos}
//         hasMore={hasMore}
//         loader={<h4>Loading...</h4>}
//         endMessage={<p>No more photos to show.</p>}
//       >
//         <Masonry
//           breakpointCols={breakpointColumnsObj}
//           className="photoSection-myMasonryGrid"
//           columnClassName="photoSection-myMasonryGridColumn"
//         >
//           {photos.map((photo, index) => (
//             <PhotoCard
//               key={photo.id} // Ensure each PhotoCard has a unique key
//               photo={photo}
//               onClick={() => openModalAtIndex(index)}
//             />
//           ))}
//         </Masonry>
//       </InfiniteScroll>

//       {/* Photo Modal */}
//       <PhotoModal
//         isOpen={isModalOpen}
//         onRequestClose={closeModal}
//         images={photos}
//         startIndex={currentPhotoIndex}
//       />
//     </section>
//   );
// }

// components/PhotoSection.js

import { useEffect, useState, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry from 'react-masonry-css';
import PhotoModal from './PhotoModal';
import '../styles/public/home.css';
import PhotoCard from './PhotoCard';
import { usePhotos } from '../context/PhotoContext';
import Filter from './Filter';
import { Box, IconButton, Collapse } from '@mui/material';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Props:
 *   scope: 'home' or 'album'
 *   albumId: number (required if scope === 'album')
 *   initialPhotos?: array (optional, if you want to pass SSR-fetched photos)
 *   enableFilters?: boolean (optional, if you want filters)
 */
export default function PhotoSection({
  scope = 'home',
  albumId = null,
  initialPhotos = [],
  enableFilters = true,
  isOwner = false,
  onSelectPhoto = () => {},
  selectedPhotoIds = [],
  isEditMode = false,
}) {

  if (scope === 'album' && !albumId) {
    return null; // Prevent rendering with invalid props
  }

  const {
    photos,
    addPhotos,
    resetPhotos,
    filters,
    toggleLike,
    toggleFavourite,
  } = usePhotos();

  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);

  // Debugging albumId
  useEffect(() => {
  }, [albumId]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Filter panel states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  // The masonry breakpoints
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  /**
   * fetchPhotos
   *  - If scope === 'home', fetch from /api/random-photos
   *  - If scope === 'album', fetch from /api/albums/[albumId]/photos
   */
  const fetchPhotos = async () => {
    try {
      let endpoint = '';
      // For Home
      if (scope === 'home') {
        const categoriesQuery = filters.categories?.length
          ? `&categories=${filters.categories.join(',')}`
          : '';
        endpoint = `/api/random-photos?cursor=${nextCursor || ''}&limit=20${categoriesQuery}`;
        
      }
      // For Album
      else if (scope === 'album') {
        endpoint = `/api/albums/${albumId}/photos?cursor=${nextCursor || ''}&limit=20`;
      }

      if (!endpoint) return;

      const res = await fetch(endpoint);
      if (!res.ok) {
        return;
      }
      const data = await res.json();

      // Update nextCursor
      if (data.nextCursor) {
        setNextCursor(data.nextCursor);
      } else {
        setHasMore(false);
      }

      // Add the returned photos to the PhotoContext
      if (data.photos?.length) {
        addPhotos(data.photos);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  // On mount or filters change -> reset + fetch
  useEffect(() => {
    // If you're using filters on the home page only, you can conditionally reset
    if (scope === 'home' && enableFilters) {
      resetPhotos();
      setNextCursor(null);
      setHasMore(true);
      fetchPhotos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // If you pass initialPhotos from SSR, we can seed them into context
  // e.g. for an album page, the server might have fetched them
  useEffect(() => {
    if (initialPhotos.length > 0) {
      resetPhotos();
      addPhotos(initialPhotos);
      if (scope === 'album') {
        setHasMore(false); // All photos are loaded via SSR
      } else {
        setHasMore(initialPhotos.length >= 20); // Assume more photos if initialPhotos reach the limit
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPhotos]);

  // Focus on the first checkbox when filter opens
  useEffect(() => {
    if (isFilterOpen && filterRef.current) {
      const firstCheckbox = filterRef.current.querySelector(
        'input[type="checkbox"]'
      );
      if (firstCheckbox) {
        firstCheckbox.focus();
      }
    }
  }, [isFilterOpen]);

  // Modal handlers
  const openModalAtIndex = (index) => {
    setCurrentPhotoIndex(index);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="photoSection">
      {/* Conditionally show filter only if scope=home and enableFilters is true */}
      {scope === 'home' && enableFilters && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
            <IconButton
              onClick={() => setIsFilterOpen((prev) => !prev)}
              aria-label="Toggle filter options"
              color="primary"
              aria-expanded={isFilterOpen}
              aria-controls="filter-panel"
            >
              <FilterAltRoundedIcon className="icon" />
            </IconButton>
          </Box>

          <Collapse in={isFilterOpen} id="filter-panel">
            <Box sx={{ marginBottom: 2 }} ref={filterRef}>
              <Filter />
            </Box>
          </Collapse>
        </>
      )}

      {/* Infinite Scroll and Masonry */}
      <InfiniteScroll
        dataLength={photos.length}
        next={fetchPhotos}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p class="infinite-scroll-end-msg">No more photos to show.</p>}
      >
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="photoSection-myMasonryGrid"
          columnClassName="photoSection-myMasonryGridColumn"
        >
          {photos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onClick={() => openModalAtIndex(index)}
              isSelected={isOwner ? selectedPhotoIds.includes(photo.id) : undefined}
              onSelect={isOwner ? onSelectPhoto : undefined}
              isEditMode={isEditMode} 
            />
          ))}
        </Masonry>
      </InfiniteScroll>

      {/* Photo Modal */}
      <PhotoModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        images={photos}
        startIndex={currentPhotoIndex}
      />
    </section>
  );
}