// import { useRouter } from 'next/router';
// import { useState } from 'react';
// import PhotographerSidebar from './PhotographerSidebar';
// import AlbumSidebar from './AlbumSidebar';
// import SettingsSidebar from './SettingsSidebar';
// import '../styles/public/global.css'; 
// import '../styles/public/photographerLayout.css'; 
// import React from 'react'; // needed for cloneElement

// export default function Layout({ children }) {
//   const router = useRouter();
//   const path = router.pathname;

//   let SidebarComponent = PhotographerSidebar;

//   // State used to re-fetch albums in AlbumSidebar
//   const [sidebarRefresh, setSidebarRefresh] = useState(0);

//   function triggerSidebarRefresh() {
//     setSidebarRefresh((prev) => prev + 1);
//   }

//   // Determine which sidebar to show based on the route
//   if (path.startsWith('/photographer/album')) {
//     SidebarComponent = AlbumSidebar;
//   } else if (path.startsWith('/photographer/settings')) {
//     SidebarComponent = SettingsSidebar;
//   }

//   return (
//     <div className="photographer-page">
//       {/* Fixed (non-scrolling) sidebar */}
//       <div className="photogrpager-sidebar-container">
//         {/* Pass the current refresh counter to the sidebar */}
//         <SidebarComponent sidebarRefresh={sidebarRefresh} />
//       </div>

//       {/* Main content: wrap children so we can inject triggerSidebarRefresh */}
//       <div className="photographer-content-container">
//         {React.cloneElement(children, { triggerSidebarRefresh })}
//       </div>
//     </div>
//   );
// }

// components/PhotographerLayout.js

import PropTypes from 'prop-types';
import PhotographerSidebar from './PhotographerSidebar';
import AlbumSidebar from './AlbumSidebar';
import '../styles/public/global.css'; 
import '../styles/public/photographerLayout.css'; 

export default function PhotographerLayout({
  children,
  isOwner,
  useAlbumSidebar,
  albums,
  photographerId,
}) {
  // If NOT the owner, we always show the album sidebar
  // If the user IS the owner, then we rely on the 'useAlbumSidebar' prop
  const finalUseAlbumSidebar = isOwner ? useAlbumSidebar : true;

  return (
    <div className="photographer-page">
      <aside className="photogrpager-sidebar-container">
        {finalUseAlbumSidebar ? (
          <AlbumSidebar
            albums={albums || []}        
            photographerId={photographerId}
            isOwner={isOwner}
          />
        ) : (
          <PhotographerSidebar
            photographerId={photographerId}
            isOwner={isOwner}
          />
        )}
      </aside>
      <main className="photographer-content-container">{children}</main>

    </div>
  );
}

PhotographerLayout.propTypes = {
  children: PropTypes.node.isRequired,
  isOwner: PropTypes.bool.isRequired,
  photographerId: PropTypes.number,
  useAlbumSidebar: PropTypes.bool,
  albums: PropTypes.array,
};

PhotographerLayout.defaultProps = {
  useAlbumSidebar: false,
  albums: [],   // Default to empty array
};


