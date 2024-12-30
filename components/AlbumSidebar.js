// components/AlbumSidebar.js

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import axios from 'axios'; 
import '../styles/public/photographerLayout.css'; 
import CreateAlbumModal from './CreateAlbumModal';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import PropTypes from 'prop-types';

export default function AlbumSidebar({ albums = [], photographerId, isOwner, photographerUsername }) {
  const router = useRouter();
  const { albumSlug } = router.query; // Changed from albumId to albumSlug

  // Maintain a local copy of the albums
  const [localAlbums, setLocalAlbums] = useState(albums);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // A helper to see if we’re on the “Profile” route
  const isProfileActive = router.pathname === '/[username]';

  // Handle newly created album
  const handleAlbumCreated = (newAlbum) => {
    if (!newAlbum || !newAlbum.id || !newAlbum.slug) {
      console.error('New album is missing required fields:', newAlbum);
      return;
    }
    // Append the new album to the local state
    setLocalAlbums((prev) => [...prev, newAlbum]);

    // Navigate to the new album page using slug
    router.push(`/${photographerUsername}/albums/${newAlbum.slug}`);
  };

  return (
    <div className="sidebar-container sub-sidebar">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => router.push(`/${photographerUsername}`)}
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
              href={`/${photographerUsername}`}
              passHref
              className={`sub-item ${isProfileActive ? 'active' : ''}`}
            >
                Profile
            </Link>
          </li>
        )}

        <li>
          <Link
            href={`/${photographerUsername}/albums`}
            passHref
            className={`sub-item ${!isProfileActive && !albumSlug ? 'active' : ''}`}
          >
              All Albums
          </Link>
        </li>

        {localAlbums.map((album) => (
          <li key={album.id}>
            <Link
              href={`/${photographerUsername}/albums/${album.slug}`}
              passHref
              className={`sub-item ${!isProfileActive && albumSlug === album.slug? 'active': ''}`}
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
          photographerUsername={photographerUsername} // Pass photographerUsername
        />
      )}
    </div>
  );
}

AlbumSidebar.propTypes = {
  albums: PropTypes.array,
  photographerId: PropTypes.number.isRequired,
  isOwner: PropTypes.bool.isRequired,
  photographerUsername: PropTypes.string.isRequired,
};

AlbumSidebar.defaultProps = {
  albums: [],
};