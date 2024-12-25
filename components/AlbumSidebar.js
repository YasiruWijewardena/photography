// components/AlbumSidebar.js

// import Link from 'next/link';
// import { useRouter } from 'next/router';
// import { useState, useEffect } from 'react';
// import CreateAlbumModal from './CreateAlbumModal';
// import AddRoundedIcon from '@mui/icons-material/AddRounded';
// import '../styles/public/photographerLayout.css';

// export default function AlbumSidebar({ photographerId, isOwner }) {
//   const router = useRouter();
//   const [albums, setAlbums] = useState([]);
//   const [showCreateModal, setShowCreateModal] = useState(false);

//   useEffect(() => {
//     const fetchAlbums = async () => {
//       try {
//         let url = '';
//         if (isOwner) {
//           // Fetch owner's albums (requires authentication)
//           url = '/api/albums';
//         } else {
//           // Fetch albums of another photographer (public)
//           url = `/api/photographer/${photographerId}/albums`;
//         }
//         const res = await fetch(url);
//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }
//         const data = await res.json();
//         setAlbums(data.albums || []);
//       } catch (error) {
//         console.error('Failed to fetch albums:', error);
//       }
//     };

//     if (photographerId) {
//       fetchAlbums();
//     }
//   }, [photographerId, isOwner]);

//   return (
//     <div className='sidebar-container sub-sidebar'>
//       <button onClick={() => router.push(`/photographer/${photographerId}`)} className='back-button'>
//         ← Back
//       </button>
//       {isOwner && (
//         <button onClick={() => setShowCreateModal(true)} className='create-album-btn'>
//           <span>Create New Album</span>
//           <AddRoundedIcon />
//         </button>
//       )}
//       <ul>
//         {albums.map(album => {
//           const isActive = router.asPath === `/photographer/${photographerId}/albums/${album.id}`;
//           return (
//             <li key={album.id} style={{ marginBottom: '5px' }}>
//               <Link href={`/photographer/${photographerId}/albums/${album.id}`} className={`sub-item ${isActive ? 'active' : ''}`}>
//                 {album.title}
//               </Link>
//             </li>
//           );
//         })}
//       </ul>

//       {/* Create Album Modal */}
//       {isOwner && (
//         <CreateAlbumModal 
//           isOpen={showCreateModal}
//           onClose={() => setShowCreateModal(false)}
//           onAlbumCreated={() => {
//             setShowCreateModal(false);
//             // Re-fetch the albums after creation
//             setAlbums(prevAlbums => [...prevAlbums, /* new album data */]);
//           }}
//         />
//       )}
      
//     </div>
//   );
// }

// // components/AlbumSidebar.js

// import Link from 'next/link';
// import { useRouter } from 'next/router';
// import { useState, useEffect } from 'react';
// import '../styles/public/photographerLayout.css';
// import CreateAlbumModal from './CreateAlbumModal';
// import AddRoundedIcon from '@mui/icons-material/AddRounded';

// export default function AlbumSidebar({ albums = [], photographerId, isOwner }) {
//   const router = useRouter();
//   const { albumId } = router.query;
//   const [showCreateModal, setShowCreateModal] = useState(false);

//   return (
//     <div className='sidebar-container sub-sidebar'>
//       {/* Back Button */}
//       <button
//         type="button"
//         onClick={() => router.back()}
//         className="back-button"
//       >
//         Back
//       </button>
//       {/* For Owners: show Create Album */}
//       {isOwner && (
//           <button onClick={() => setShowCreateModal(true)} className="create-album-btn">
//           <span>Create Album</span>
//           <AddRoundedIcon />
//           </button>
//         )}
//       <ul>
//         <li>
//           <Link href={`/photographer/${photographerId}/albums`} className={`sub-item ${!albumId ? 'active' : ''}`} passHref>
//               All Albums
//           </Link>
//         </li>
//         {albums.map((album) => (
//           <li key={album.id}>
//             <Link href={`/photographer/${photographerId}/albums/${album.id}`} className={`sub-item  ${
//                   albumId === album.id.toString() ? 'active' : ''
//                 }`} passHref>
//                 {album.title}
//             </Link>
//           </li>
//         ))}
//       </ul>

//       {/* Create Album Modal */}
//       {isOwner && (
//         <CreateAlbumModal 
//           isOpen={showCreateModal}
//           onClose={() => setShowCreateModal(false)}
//           onAlbumCreated={() => {
//             setShowCreateModal(false);
//             //Re-fetch the albums after creation
//             //setAlbums(prevAlbums => [...prevAlbums, /* new album data */]);
//           }}
//         />
//       )}
//     </div>
//   );
// }

/// components/AlbumSidebar.js

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import axios from 'axios'; 
import '../styles/public/photographerLayout.css'; 
import CreateAlbumModal from './CreateAlbumModal';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

export default function AlbumSidebar({ albums = [], photographerId, isOwner }) {
  const router = useRouter();
  const { albumId } = router.query;

  // Maintain a local copy of the albums
  const [localAlbums, setLocalAlbums] = useState(albums);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // A helper to see if we’re on the “Profile” route
  const isProfileActive = router.pathname === '/photographer/[id]';

  // Handle newly created album
  const handleAlbumCreated = (newAlbum) => {
    if (!newAlbum || !newAlbum.id) {
      console.error('New album is missing an id:', newAlbum);
      return;
    }
    // Append the new album to the local state
    setLocalAlbums((prev) => [...prev, newAlbum]);

    // Navigate to the new album page
    router.push(`/photographer/${photographerId}/albums/${newAlbum.id}`);
  };

  return (
    <div className="sidebar-container sub-sidebar">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => router.push(`/photographer/${photographerId}`)}
        className="back-button"
      >
        Back
      </button>

      {/* Create Album button for owners */}
      {isOwner && (
        <button
          onClick={() => setShowCreateModal(true)}
          className="create-album-btn"
        >
          <span>Create Album</span>
          <AddRoundedIcon />
        </button>
      )}

      <ul>
        {/* PROFILE link (only if not the owner) */}
        {!isOwner && (
          <li>
            <Link
              href={`/photographer/${photographerId}`}
              className={`sub-item ${isProfileActive ? 'active' : ''}`}
            >
              Profile
            </Link>
          </li>
        )}

        <li>
          <Link
            href={`/photographer/${photographerId}/albums`}
            className={`sub-item ${
              // "All Albums" is active if:
              // 1) we are NOT on the profile route, AND
              // 2) albumId is falsy (meaning /albums or no specific album)
              !isProfileActive && !albumId ? 'active' : ''
            }`}
          >
            All Albums
          </Link>
        </li>

        {localAlbums.map((album) => (
          <li key={album.id}>
            <Link
              href={`/photographer/${photographerId}/albums/${album.id}`}
              className={`sub-item ${
                // Individual album is active if:
                // 1) we are NOT on the profile route, AND
                // 2) albumId matches this album
                !isProfileActive && albumId === album.id.toString()
                  ? 'active'
                  : ''
              }`}
            >
              {album.title}
            </Link>
          </li>
        ))}
      </ul>

      {isOwner && (
        <CreateAlbumModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onAlbumCreated={handleAlbumCreated}
        />
      )}
    </div>
  );
}