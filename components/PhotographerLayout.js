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

import MainSidebar from './PhotographerSidebar';
import AlbumSidebar from './AlbumSidebar';
import SettingsSidebar from './SettingsSidebar';
import { useRouter } from 'next/router';

export default function PhotographerLayout({ isOwner, photographerId, children }) {
  const router = useRouter();
  const path = router.pathname;

  // Determine which sidebar to render based on the current path and ownership
  let SidebarComponent = null;

  if (isOwner) {
    if (path.includes('/settings')) {
      SidebarComponent = <SettingsSidebar photographerId={photographerId} />;
    } else {
      SidebarComponent = <MainSidebar photographerId={photographerId} />;
    }
  } else {
    SidebarComponent = <AlbumSidebar photographerId={photographerId} isOwner={isOwner} />;
  }

  return (
    <div className="photographer-layout">
      {SidebarComponent}
      <main>{children}</main>
      <style jsx>{`
        .photographer-layout {
          display: flex;
          min-height: 100vh;
        }
        main {
          flex: 1;
          padding: 20px;
          margin-left: 250px; /* Adjust based on sidebar width */
        }
      `}</style>
    </div>
  );
}


