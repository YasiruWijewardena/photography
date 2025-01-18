// // components/PhotographerLayout.js

// import PropTypes from 'prop-types';
// import PhotographerSidebar from './PhotographerSidebar';
// import AlbumSidebar from './AlbumSidebar';
// import '../styles/public/global.css'; 
// import '../styles/public/photographerLayout.css'; 
// import { usePhotos } from '../context/PhotoContext'; // Import usePhotos
// import { useEffect } from 'react';

// export default function PhotographerLayout({
//   children,
//   isOwner,
//   useAlbumSidebar,
//   photographerUsername, 
//   albums,
//   photographerId,
// }) {
//   // If NOT the owner, we always show the album sidebar
//   // If the user IS the owner, then we rely on the 'useAlbumSidebar' prop
//   const finalUseAlbumSidebar = isOwner ? useAlbumSidebar : true;

//   return (
//     <>
//     <div className="photographer-page">
//       <aside className="photogrpager-sidebar-container">
//         {finalUseAlbumSidebar ? (
//           <AlbumSidebar
//             albums={albums || []}        
//             photographerId={photographerId}
//             isOwner={isOwner}
//             photographerUsername={photographerUsername}
//           />
//         ) : (
//           <PhotographerSidebar
//             photographerId={photographerId}
//             isOwner={isOwner}
//             photographerUsername={photographerUsername}
//           />
//         )}
//       </aside>
//       <main className="photographer-content-container">{children}</main>

//     </div>
//     </>
    
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
//   albums: [],   // Default to empty array
// };


import PropTypes from 'prop-types';
import PhotographerSidebar from './PhotographerSidebar';
import PhotographerFavSidebar from './PhotographerFavSidebar'; // Import PhotographerFavSidebar
import AlbumSidebar from './AlbumSidebar';
import PublicLayout from './PublicLayout'; // Import PublicLayout
import { useRouter } from 'next/router';
import { useEffect } from 'react'; 
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
  const finalUseAlbumSidebar = isOwner ? useAlbumSidebar : true;

  // Determine if the user is viewing favourites based on the current route
  const isViewingFavourites =
    router.pathname.includes('/favourites/albums') ||
    router.pathname.includes('/favourites/photos');

  useEffect(() => {
    document.body.classList.add('photographer-layout');

    // Cleanup by removing the class when the component is unmounted
    return () => {
      document.body.classList.remove('photographer-layout');
      document.body.classList.remove('viewing-favourites');
    };
  }, []);

  return (
    <PublicLayout> {/* Wrap the photographer layout with PublicLayout */}
      <div className="photographer-page">
        <aside className="photographer-sidebar-container">
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
        <main className="photographer-content-container">{children}</main>
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