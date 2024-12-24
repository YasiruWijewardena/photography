// components/AlbumSidebar.js

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import CreateAlbumModal from './CreateAlbumModal';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import '../styles/public/photographerLayout.css';

export default function AlbumSidebar({ photographerId, isOwner }) {
  const router = useRouter();
  const [albums, setAlbums] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        let url = '';
        if (isOwner) {
          // Fetch owner's albums (requires authentication)
          url = '/api/albums';
        } else {
          // Fetch albums of another photographer (public)
          url = `/api/photographer/${photographerId}/albums`;
        }
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setAlbums(data.albums || []);
      } catch (error) {
        console.error('Failed to fetch albums:', error);
      }
    };

    if (photographerId) {
      fetchAlbums();
    }
  }, [photographerId, isOwner]);

  return (
    <div className='sidebar-container sub-sidebar'>
      <button onClick={() => router.push(`/photographer/${photographerId}`)} className='back-button'>
        ← Back
      </button>
      {isOwner && (
        <button onClick={() => setShowCreateModal(true)} className='create-album-btn'>
          <span>Create New Album</span>
          <AddRoundedIcon />
        </button>
      )}
      <ul>
        {albums.map(album => {
          const isActive = router.asPath === `/photographer/${photographerId}/albums/${album.id}`;
          return (
            <li key={album.id} style={{ marginBottom: '5px' }}>
              <Link href={`/photographer/${photographerId}/albums/${album.id}`} className={`sub-item ${isActive ? 'active' : ''}`}>
                {album.title}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Create Album Modal */}
      {isOwner && (
        <CreateAlbumModal 
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onAlbumCreated={() => {
            setShowCreateModal(false);
            // Re-fetch the albums after creation
            setAlbums(prevAlbums => [...prevAlbums, /* new album data */]);
          }}
        />
      )}
      
    </div>
  );
}
