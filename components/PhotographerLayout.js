// import PropTypes from 'prop-types';
// import PhotographerSidebar from './PhotographerSidebar';
// import PhotographerFavSidebar from './PhotographerFavSidebar'; // Import PhotographerFavSidebar
// import AlbumSidebar from './AlbumSidebar';
// import PublicLayout from './PublicLayout'; // Import PublicLayout
// import { useRouter } from 'next/router';
// import { useEffect } from 'react'; 
// import '../styles/public/global.css'; 
// import '../styles/public/photographerLayout.css'; 

// export default function PhotographerLayout({
//   children,
//   isOwner,
//   useAlbumSidebar,
//   photographerUsername,
//   albums,
//   photographerId,
// }) {
//   const router = useRouter();
//   const finalUseAlbumSidebar = isOwner ? useAlbumSidebar : true;

//   // Determine if the user is viewing favourites based on the current route
//   const isViewingFavourites =
//     router.pathname.includes('/favourites/albums') ||
//     router.pathname.includes('/favourites/photos');

//   useEffect(() => {
//     document.body.classList.add('photographer-layout');

//     // Cleanup by removing the class when the component is unmounted
//     return () => {
//       document.body.classList.remove('photographer-layout');
//       document.body.classList.remove('viewing-favourites');
//     };
//   }, []);

//   return (
//     <PublicLayout> {/* Wrap the photographer layout with PublicLayout */}
//       <div className="photographer-page">
//         <aside className="photographer-sidebar-container">
//           {isViewingFavourites ? (
//             <PhotographerFavSidebar photographerUsername={photographerUsername} />
//           ) : finalUseAlbumSidebar ? (
//             <AlbumSidebar
//               albums={albums || []}
//               photographerId={photographerId}
//               isOwner={isOwner}
//               photographerUsername={photographerUsername}
//             />
//           ) : (
//             <PhotographerSidebar
//               photographerId={photographerId}
//               isOwner={isOwner}
//               photographerUsername={photographerUsername}
//             />
//           )}
//         </aside>
//         <main className="photographer-content-container">{children}</main>
//       </div>
//     </PublicLayout>
//   );
// }

// PhotographerLayout.propTypes = {
//   children: PropTypes.node.isRequired,
//   isOwner: PropTypes.bool.isRequired,
//   photographerId: PropTypes.number,
//   photographerUsername: PropTypes.string.isRequired,
//   useAlbumSidebar: PropTypes.bool,
//   albums: PropTypes.array,
// };

// PhotographerLayout.defaultProps = {
//   useAlbumSidebar: false,
//   albums: [],
// };

// components/PhotographerLayout.js
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';

import PublicLayout from './PublicLayout';
import PhotographerSidebar from './PhotographerSidebar';
import PhotographerFavSidebar from './PhotographerFavSidebar';
import AlbumSidebar from './AlbumSidebar';

import MenuRoundedIcon from '@mui/icons-material/MenuRounded'; // Hamburger icon
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'; // Close icon

import '../styles/public/global.css';
import '../styles/public/photographerLayout.css';

export default function PhotographerLayout({
  children,
  isOwner,
  useAlbumSidebar,
  photographerUsername,
  albums,
  photographerId,
}) {
  const router = useRouter();

  // For toggling the sidebar in mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Track the scroll direction to hide/show hamburger
  const [scrollDir, setScrollDir] = useState('up'); // or 'down'
  const lastScrollY = useRef(0);

  // Decide which sidebar
  const finalUseAlbumSidebar = isOwner ? useAlbumSidebar : true;

  // Check if route is "favourites"
  const isViewingFavourites =
    router.pathname.includes('/favourites/albums') ||
    router.pathname.includes('/favourites/photos');

  useEffect(() => {
    document.body.classList.add('photographer-layout');
    return () => {
      document.body.classList.remove('photographer-layout');
      document.body.classList.remove('viewing-favourites');
    };
  }, []);

  // Listen for scroll events to set scrollDir = 'down' or 'up'
  const contentRef = useRef(null);

  useEffect(() => {
    const scrollContainer = contentRef.current;
    const THRESHOLD = 20;
  
    if (!scrollContainer) return;
  
    const handleScroll = () => {
      const currentY = scrollContainer.scrollTop;
      if (currentY - lastScrollY.current > THRESHOLD) {
        // scrolled down by > THRESHOLD
        setScrollDir('down');
        lastScrollY.current = currentY;
      } else if (lastScrollY.current - currentY > THRESHOLD) {
        // scrolled up by > THRESHOLD
        setScrollDir('up');
        lastScrollY.current = currentY;
      }
      // If it's within +-5px, do nothing, ignore it
    };
  
    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  // Sidebar open/close
  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <PublicLayout>
      <div className="photographer-page">
        {/* 
          The hamburger. 
          We'll add a dynamic class if scrollDir === 'down' to hide it. 
          Also a high z-index and position: fixed to float on top.
        */}
        <button
          className={`mobile-hamburger-btn ${scrollDir === 'down' ? 'hide' : ''}`}
          onClick={openSidebar}
          aria-label="Open Sidebar"
        >
          <MenuRoundedIcon />
        </button>

        {/* Overlay if sidebar is open */}
        {isSidebarOpen && (
          <div 
            className="sidebar-overlay"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/* The sidebar */}
        <aside 
          className={`photographer-sidebar-container ${isSidebarOpen ? 'open' : ''}`}
        >
          {/* Close button on mobile */}
          <button
            className="sidebar-close-button"
            onClick={closeSidebar}
            aria-label="Close Sidebar"
          >
            <CloseRoundedIcon />
          </button>

          {/* The actual sidebar content */}
          {isViewingFavourites ? (
            <PhotographerFavSidebar photographerUsername={photographerUsername} />
          ) : finalUseAlbumSidebar ? (
            <AlbumSidebar
              albums={albums || []}
              photographerId={photographerId}
              isOwner={isOwner}
              photographerUsername={photographerUsername}
            />
          ) : (
            <PhotographerSidebar
              photographerId={photographerId}
              isOwner={isOwner}
              photographerUsername={photographerUsername}
            />
          )}
        </aside>

        {/* Main content */}
        <main className="photographer-content-container"  ref={contentRef}>{children}</main>
      </div>
    </PublicLayout>
  );
}

PhotographerLayout.propTypes = {
  children: PropTypes.node.isRequired,
  isOwner: PropTypes.bool.isRequired,
  photographerId: PropTypes.number,
  photographerUsername: PropTypes.string.isRequired,
  useAlbumSidebar: PropTypes.bool,
  albums: PropTypes.array,
};

PhotographerLayout.defaultProps = {
  useAlbumSidebar: false,
  albums: [],
};