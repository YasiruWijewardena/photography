// components/PhotoSection.js

import { useEffect, useState, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry from 'react-masonry-css';
import PhotoModal from './PhotoModal'; // Adjust the import path as necessary
import '../styles/public/home.css';
import PhotoCard from './PhotoCard';
import { usePhotos } from '../context/PhotoContext';
import Filter from './Filter'; // Import the Filter component
import { Box, IconButton, Collapse } from '@mui/material';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded'; // Import the FilterList icon

export default function PhotoSection() {
  const { photos, addPhotos, resetPhotos, filters, toggleLike, toggleFavourite } = usePhotos();
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const [isFilterOpen, setIsFilterOpen] = useState(false); // State to manage filter panel visibility
  const filterRef = useRef(null); // Ref for filter panel

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  const fetchPhotos = async () => {
    try {
      const categoriesQuery = filters.categories.length > 0 ? `&categories=${filters.categories.join(',')}` : '';
      const res = await fetch(`/api/random-photos?cursor=${nextCursor || ''}&limit=20${categoriesQuery}`);
      const data = await res.json();
      console.log('Fetched Photos:', data);
      if (data.nextCursor) {
        setNextCursor(data.nextCursor);
      } else {
        setHasMore(false);
      }
      addPhotos(data.photos);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  // Fetch photos when component mounts or filters change
  useEffect(() => {
    // Reset photos and pagination when filters change
    const resetAndFetch = async () => {
      resetPhotos();
      setNextCursor(null);
      setHasMore(true);
      await fetchPhotos();
    };
    resetAndFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Shift focus to filter panel when it opens
  useEffect(() => {
    if (isFilterOpen && filterRef.current) {
      // Shift focus to the first checkbox in the filter panel
      const firstCheckbox = filterRef.current.querySelector('input[type="checkbox"]');
      if (firstCheckbox) {
        firstCheckbox.focus();
      }
    }
  }, [isFilterOpen]);

  const openModalAtIndex = (index) => {
    setCurrentPhotoIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="photoSection">
      {/* Filter Toggle Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
        <IconButton
          onClick={() => setIsFilterOpen(prev => !prev)}
          aria-label="Toggle filter options"
          color="primary"
          aria-expanded={isFilterOpen}
          aria-controls="filter-panel"
        >
          <FilterAltRoundedIcon className="icon" />
        </IconButton>
      </Box>

      {/* Collapsible Filter Panel */}
      <Collapse in={isFilterOpen} id="filter-panel">
        <Box sx={{ marginBottom: 2 }} ref={filterRef}>
          <Filter />
        </Box>
      </Collapse>

      {/* Infinite Scroll and Masonry Grid */}
      <InfiniteScroll
        dataLength={photos.length}
        next={fetchPhotos}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p>No more photos to show.</p>}
      >
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="photoSection-myMasonryGrid"
          columnClassName="photoSection-myMasonryGridColumn"
        >
          {photos.map((photo, index) => (
            <PhotoCard
              key={photo.id} // Ensure each PhotoCard has a unique key
              photo={photo}
              onClick={() => openModalAtIndex(index)}
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
