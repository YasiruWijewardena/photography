// components/PhotographerLayout.js

import PropTypes from 'prop-types';
import PhotographerSidebar from './PhotographerSidebar';
import AlbumSidebar from './AlbumSidebar';
import '../styles/public/global.css'; 
import '../styles/public/photographerLayout.css'; 
import { usePhotos } from '../context/PhotoContext'; // Import usePhotos
import { useEffect } from 'react';

export default function PhotographerLayout({
  children,
  isOwner,
  useAlbumSidebar,
  photographerUsername, 
  albums,
  photographerId,
}) {
  // If NOT the owner, we always show the album sidebar
  // If the user IS the owner, then we rely on the 'useAlbumSidebar' prop
  const finalUseAlbumSidebar = isOwner ? useAlbumSidebar : true;

  return (
    <>
    <div className="photographer-page">
      <aside className="photogrpager-sidebar-container">
        {finalUseAlbumSidebar ? (
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
    </>
    
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
  albums: [],   // Default to empty array
};


