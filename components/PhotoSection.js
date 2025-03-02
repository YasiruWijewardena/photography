// // components/PhotoSection.js

// import { useState, useEffect, useRef } from 'react';
// import InfiniteScroll from 'react-infinite-scroll-component';
// import Masonry from 'react-masonry-css';
// import PhotoModal from './PhotoModal';
// import '../styles/public/home.css';
// import PhotoCard from './PhotoCard';
// import { usePhotos } from '../context/PhotoContext';
// import Filter from './Filter';
// import { Box, IconButton, Collapse } from '@mui/material';
// import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
// import PropTypes from 'prop-types';
// import SkeletonPhotoCard from './SkeletonPhotoCard';

// /**
//  * Props:
//  *   scope: 'home' | 'album' | 'favourites'
//  *   type: 'albums' | 'photos' // Relevant when scope is 'favourites'
//  *   albumSlug: string (required if scope === 'album')
//  *   initialPhotos?: array (optional, if you want to pass SSR-fetched photos)
//  *   enableFilters?: boolean (optional, if you want filters)
//  *   isFavouritePage?: boolean (optional, to indicate if used in Favourites page)
//  *   onUnfavourite?: function (optional, handler for unfavouriting)
//  */
// export default function PhotoSection({
//   scope = 'home',
//   type = null,
//   albumSlug = null,
//   initialPhotos = [],
//   enableFilters = true,
//   isOwner = false,
//   onSelectPhoto = () => {},
//   selectedPhotoIds = [],
//   isEditMode = false,
//   username,
//   isFavouritePage = false, // New prop
//   onUnfavourite = null,    // New prop
// }) {
//   if (scope === 'album' && !albumSlug) {
//     return null; // Prevent rendering with invalid props
//   }

//   const {
//     photos,
//     addPhotos,
//     resetPhotos,
//     filters,
//     toggleLike,
//     toggleFavourite,
//   } = usePhotos();
//   const [hasMore, setHasMore] = useState(true);
//   const [nextCursor, setNextCursor] = useState(null);

//   // Modal states
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

//   // Filter panel states
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const filterRef = useRef(null);

//   // The masonry breakpoints
//   const breakpointColumnsObj = {
//     default: 3,
//     1400: 2,
//     700: 1
//   };

//   /**
//    * fetchPhotos
//    *  - If scope === 'home', fetch from /api/random-photos
//    *  - If scope === 'album', fetch from /api/albums/[albumSlug]/photos
//    *  - If scope === 'favourites' and type === 'photos', fetch from /api/customer/[username]/favourites/photos
//    */
//   const fetchPhotos = async () => {
//     try {
//       let endpoint = '';
//       // For Home
//       if (scope === 'home') {
//         const categoriesQuery = filters.categories?.length
//           ? `&categories=${filters.categories.join(',')}`
//           : '';
//         endpoint = `/api/random-photos?cursor=${nextCursor || ''}&limit=20${categoriesQuery}`;
//       }
//       // For Album
//       else if (scope === 'album') {
//         endpoint = `/api/albums/${albumSlug}/photos?cursor=${nextCursor || ''}&limit=20`;
//       }
//       // For Favourites Photos
//       else if (scope === 'favourites' && type === 'photos') {
//         if (!username) {
//           // If username is not passed as prop, try to get it from the router
//           const { username: routerUsername } = router.query;
//           if (routerUsername) {
//             endpoint = `/api/customer/${routerUsername}/favourites/photos?cursor=${nextCursor || ''}&limit=20`;
//           } else {
//             console.error('Username is required for fetching favourite photos.');
//             return;
//           }
//         } else {
//           endpoint = `/api/customer/${username}/favourites/photos?cursor=${nextCursor || ''}&limit=20`;
//         }
//       }

//       if (!endpoint) return;

//       const res = await fetch(endpoint);
//       if (!res.ok) {
//         return;
//       }
//       const data = await res.json();

//       // Update nextCursor
//       if (data.nextCursor) {
//         setNextCursor(data.nextCursor);
//       } else {
//         setHasMore(false);
//       }

//       // Add the returned photos to the PhotoContext
//       if (data.photos?.length) {
//         addPhotos(data.photos);
//       }
//     } catch (error) {
//       console.error('Error fetching photos:', error);
//     }
//   };

//   // On mount or filters change -> reset + fetch
//   useEffect(() => {
//     // If you're using filters on the home page only, you can conditionally reset
//     if (scope === 'home' && enableFilters) {
//       resetPhotos();
//       setNextCursor(null);
//       setHasMore(true);
//       fetchPhotos();
//     }
//     // Reset and fetch for Favourites Photos
//     else if (scope === 'favourites' && type === 'photos') {
//       resetPhotos();
//       setNextCursor(null);
//       setHasMore(true);
//       fetchPhotos();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filters, scope, type]);

//   // If you pass initialPhotos from SSR, we can seed them into context
//   // e.g. for an album page, the server might have fetched them
//   // useEffect(() => {
//   //   if (initialPhotos.length > 0) {
//   //     resetPhotos();
//   //     addPhotos(initialPhotos);
//   //     if (scope === 'album' || (scope === 'favourites' && type === 'photos')) {
//   //       setHasMore(false); // All photos are loaded via SSR
//   //     } else {
//   //       setHasMore(initialPhotos.length >= 20); // Assume more photos if initialPhotos reach the limit
//   //     }
//   //   }else{
//   //     resetPhotos();
//   //     setHasMore(false);
//   //   }
//   //   // eslint-disable-next-line react-hooks/exhaustive-deps
//   // }, [initialPhotos, scope, type]);

//   useEffect(() => {
//     // Only update context with initialPhotos for non-home scopes.
//     if (scope !== 'home') {
//       resetPhotos();
//       addPhotos(initialPhotos);
//       if (scope === 'album' || (scope === 'favourites' && type === 'photos')) {
//         setHasMore(false); // All photos are loaded via SSR
//       } else {
//         setHasMore(initialPhotos.length >= 20);
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [initialPhotos, scope, type]);

//   // Focus on the first checkbox when filter opens
//   useEffect(() => {
//     if (isFilterOpen && filterRef.current) {
//       const firstCheckbox = filterRef.current.querySelector(
//         'input[type="checkbox"]'
//       );
//       if (firstCheckbox) {
//         firstCheckbox.focus();
//       }
//     }
//   }, [isFilterOpen]);

//   // Modal handlers
//   const openModalAtIndex = (index) => {
//     setCurrentPhotoIndex(index);
//     setIsModalOpen(true);
//   };
//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <section className="photoSection">
//       {/* Conditionally show filter only if scope=home and enableFilters is true */}
//       {scope === 'home' && enableFilters && (
//         <>
//           <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
//             <IconButton
//               onClick={() => setIsFilterOpen((prev) => !prev)}
//               aria-label="Toggle filter options"
//               color="primary"
//               aria-expanded={isFilterOpen}
//               aria-controls="filter-panel"
//             >
//               <FilterAltRoundedIcon className="icon" />
//             </IconButton>
//           </Box>

//           <Collapse in={isFilterOpen} id="filter-panel">
//             <Box sx={{ marginBottom: 2 }} ref={filterRef}>
//               <Filter />
//             </Box>
//           </Collapse>
//         </>
//       )}

//       {/* Infinite Scroll and Masonry */}
//       <InfiniteScroll
//         dataLength={photos.length}
//         next={fetchPhotos}
//         hasMore={hasMore}
//         loader={
//           <Masonry
//           breakpointCols={breakpointColumnsObj}
//           className="photoSection-myMasonryGrid"
//           columnClassName="photoSection-myMasonryGridColumn"
//         >
//           {Array.from({ length: 20 }).map((_, index) => (
//             <SkeletonPhotoCard key={index} />
//           ))}
//         </Masonry>  
//         }
//         endMessage={<p className='infinite-scroll-end-msg'>Thats all folks</p>}
//       >
//         <Masonry
//           breakpointCols={breakpointColumnsObj}
//           className="photoSection-myMasonryGrid"
//           columnClassName="photoSection-myMasonryGridColumn"
//         >
//           {photos.map((photo, index) => (
//             <PhotoCard
//               key={photo.id}
//               photo={photo}
//               onClick={() => openModalAtIndex(index)}
//               isSelected={isOwner ? selectedPhotoIds.includes(photo.id) : undefined}
//               onSelect={isOwner ? onSelectPhoto : undefined}
//               isEditMode={isEditMode} 
//               isFavouritePage={isFavouritePage} // Pass down the prop
//               onUnfavourite={onUnfavourite}     // Pass down the prop
//             />
//           ))}
//         </Masonry>
//       </InfiniteScroll>

//       {/* Photo Modal */}
//       {photos.length > 0 && (
//         <PhotoModal
//         isOpen={isModalOpen}
//         onRequestClose={closeModal}
//         images={photos} // Pass the entire list of photos
//         startIndex={currentPhotoIndex} // Specify which photo to start with
//         isFavouritePage={isFavouritePage} // Pass down the prop
//         onUnfavourite={onUnfavourite}     // Pass down the prop
//       />
//       )}
//     </section>
//   );
// }

// PhotoSection.propTypes = {
//   scope: PropTypes.oneOf(['home', 'album', 'favourites']),
//   type: PropTypes.oneOf(['albums', 'photos']),
//   albumSlug: PropTypes.string,
//   initialPhotos: PropTypes.array,
//   enableFilters: PropTypes.bool,
//   isOwner: PropTypes.bool,
//   onSelectPhoto: PropTypes.func,
//   selectedPhotoIds: PropTypes.array,
//   isEditMode: PropTypes.bool,
//   username: PropTypes.string,
//   isFavouritePage: PropTypes.bool, // New prop
//   onUnfavourite: PropTypes.func,   // New prop
// };

// PhotoSection.defaultProps = {
//   isFavouritePage: false,
//   onUnfavourite: null,
// };

import { useState, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry from 'react-masonry-css';
import PhotoModal from './PhotoModal';
import '../styles/public/home.css';
import PhotoCard from './PhotoCard';
import { usePhotos } from '../context/PhotoContext';
import Filter from './Filter';
import { Box, IconButton, Collapse } from '@mui/material';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import PropTypes from 'prop-types';
import SkeletonPhotoCard from './SkeletonPhotoCard';

export default function PhotoSection({
  scope = 'home',
  type = null,
  albumSlug = null,
  initialPhotos = [],
  enableFilters = true,
  isOwner = false,
  onSelectPhoto = () => {},
  selectedPhotoIds = [],
  isEditMode = false,
  username,
  isFavouritePage = false,
  onUnfavourite = null,
}) {
  // Global photos and functions for home scope.
  const {
    photos: globalPhotos,
    addPhotos,
    resetPhotos,
    filters,
    toggleLike: contextToggleLike,
    toggleFavourite: contextToggleFavourite,
  } = usePhotos();

  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Filter panel state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  // Masonry breakpoints
  const breakpointColumnsObj = { default: 3, 1400: 2, 700: 1 };

  // Local photos state for non-home scopes
  const [localPhotos, setLocalPhotos] = useState(initialPhotos);

  // Run this effect only once on mount.
  useEffect(() => {
    if (scope === 'home') {
      // For the home scope, use the global context.
      resetPhotos();
      addPhotos(initialPhotos);
      setHasMore(true); // Always allow infinite scroll on home.
    } else {
      // For album/chapter scope, use local state.
      setLocalPhotos(initialPhotos);
      setHasMore(initialPhotos.length >= 20); // Assuming page size of 20.
    }
    // We intentionally leave the dependency array empty.
    // If initialPhotos may change over time, consider memoizing it in the parent.
  }, []); 

  // If home scope and no photos are available initially, trigger a fetch.
  useEffect(() => {
    if (scope === 'home' && globalPhotos.length === 0) {
      fetchPhotos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, globalPhotos.length]);

  // fetchPhotos is used for all scopes when more photos may be fetched.
  const fetchPhotos = async () => {
    try {
      let endpoint = '';
      if (scope === 'home') {
        const categoriesQuery = filters.categories?.length
          ? `&categories=${filters.categories.join(',')}`
          : '';
        endpoint = `/api/random-photos?cursor=${nextCursor || ''}&limit=20${categoriesQuery}`;
      } else if (scope === 'album') {
        endpoint = `/api/albums/${albumSlug}/photos?cursor=${nextCursor || ''}&limit=20`;
      } else if (scope === 'favourites' && type === 'photos') {
        if (!username) {
          console.error('Username is required for fetching favourite photos.');
          return;
        }
        endpoint = `/api/customer/${username}/favourites/photos?cursor=${nextCursor || ''}&limit=20`;
      }
      if (!endpoint) return;

      // Bypass browser cache to ensure fresh data:
      const res = await fetch(endpoint, { cache: 'no-cache' });
      if (!res.ok) return;
      const data = await res.json();

      if (data.nextCursor) setNextCursor(data.nextCursor);
      else setHasMore(false);

      if (data.photos?.length) {
        if (scope === 'home') {
          addPhotos(data.photos);
        } else {
          setLocalPhotos((prev) => [...prev, ...data.photos]);
          if (data.photos.length < 20) setHasMore(false);
        }
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  // Modal handlers
  const openModalAtIndex = (index) => {
    setCurrentPhotoIndex(index);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  // Toggle functions for like and favourite.
  const handleToggleLike = async (photoId, albumId = null) => {
    if (scope === 'home') {
      contextToggleLike(photoId, albumId);
    } else {
      const photo = localPhotos.find((p) => p.id === photoId);
      if (!photo) return;
      try {
        const res = await fetch(`/api/photographs/${photoId}/like`, {
          method: photo.isLiked ? 'DELETE' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
        });
        if (res.ok) {
          const updatedPhoto = {
            ...photo,
            isLiked: !photo.isLiked,
            likes_count: photo.isLiked ? photo.likes_count - 1 : photo.likes_count + 1,
          };
          setLocalPhotos((prev) =>
            prev.map((p) => (p.id === photoId ? updatedPhoto : p))
          );
        } else {
          console.error('Failed to toggle like');
        }
      } catch (error) {
        console.error('Error toggling like:', error);
      }
    }
  };

  const handleToggleFavourite = async (photoId, albumId = null) => {
    if (scope === 'home') {
      contextToggleFavourite(photoId, albumId);
    } else {
      const photo = localPhotos.find((p) => p.id === photoId);
      if (!photo) return;
      try {
        const res = await fetch(`/api/photographs/${photoId}/favourite`, {
          method: photo.isFavourited ? 'DELETE' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
        });
        if (res.ok) {
          const updatedPhoto = { ...photo, isFavourited: !photo.isFavourited };
          setLocalPhotos((prev) =>
            prev.map((p) => (p.id === photoId ? updatedPhoto : p))
          );
        } else {
          console.error('Failed to toggle favourite');
        }
      } catch (error) {
        console.error('Error toggling favourite:', error);
      }
    }
  };

  // Determine which photos to render.
  const renderedPhotos = scope === 'home' ? globalPhotos : localPhotos;

  // Focus on the first checkbox when the filter panel opens.
  useEffect(() => {
    if (isFilterOpen && filterRef.current) {
      const firstCheckbox = filterRef.current.querySelector('input[type="checkbox"]');
      if (firstCheckbox) firstCheckbox.focus();
    }
  }, [isFilterOpen]);

  return (
    <section className="photoSection">
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

      <InfiniteScroll
        dataLength={renderedPhotos.length}
        next={fetchPhotos}
        hasMore={hasMore}
        loader={
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="photoSection-myMasonryGrid"
            columnClassName="photoSection-myMasonryGridColumn"
          >
            {Array.from({ length: 20 }).map((_, index) => (
              <SkeletonPhotoCard key={index} />
            ))}
          </Masonry>
        }
        endMessage={<p className="infinite-scroll-end-msg">That's all folks</p>}
      >
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="photoSection-myMasonryGrid"
          columnClassName="photoSection-myMasonryGridColumn"
        >
          {renderedPhotos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onClick={() => openModalAtIndex(index)}
              isSelected={isOwner ? selectedPhotoIds.includes(photo.id) : undefined}
              onSelect={isOwner ? onSelectPhoto : undefined}
              isEditMode={isEditMode}
              isFavouritePage={isFavouritePage}
              onUnfavourite={onUnfavourite}
              onToggleLike={() =>
                handleToggleLike(photo.id, scope === 'album' ? photo.album_id : null)
              }
              onToggleFavourite={() =>
                handleToggleFavourite(photo.id, scope === 'album' ? photo.album_id : null)
              }
            />
          ))}
        </Masonry>
      </InfiniteScroll>

      {renderedPhotos.length > 0 && (
        <PhotoModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          images={renderedPhotos}
          startIndex={currentPhotoIndex}
          isFavouritePage={isFavouritePage}
          onUnfavourite={onUnfavourite}
        />
      )}
    </section>
  );
}

PhotoSection.propTypes = {
  scope: PropTypes.oneOf(['home', 'album', 'favourites']),
  type: PropTypes.oneOf(['albums', 'photos']),
  albumSlug: PropTypes.string,
  initialPhotos: PropTypes.array,
  enableFilters: PropTypes.bool,
  isOwner: PropTypes.bool,
  onSelectPhoto: PropTypes.func,
  selectedPhotoIds: PropTypes.array,
  isEditMode: PropTypes.bool,
  username: PropTypes.string,
  isFavouritePage: PropTypes.bool,
  onUnfavourite: PropTypes.func,
};

PhotoSection.defaultProps = {
  isFavouritePage: false,
  onUnfavourite: null,
};