// components/AlbumSidebar.js

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useMemo, useEffect } from 'react';
import '../styles/public/photographerLayout.css';
import CreateAlbumModal from './CreateAlbumModal';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import PropTypes from 'prop-types';

export default function AlbumSidebar({
  albums = [],
  photographerId,
  isOwner,
  photographerUsername,
}) {
  const router = useRouter();
  const { albumSlug } = router.query;
  const asPath = router.asPath; 

  // Local album list
  const [localAlbums, setLocalAlbums] = useState(albums);

  // Modal
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Search bar
  const [searchQuery, setSearchQuery] = useState('');

  // Exactly on the profile page => "/dinethpanagoda"
  const isProfilePage = asPath === `/${photographerUsername}`;

  // Exactly on the all albums page => "/dinethpanagoda/albums"
  const isAlbumsIndex = asPath === `/${photographerUsername}/albums`;

  const isSingleAlbumPage = !!albumSlug;

  // On ANY album route?
  const isOnAlbumRoutes = asPath.startsWith(`/${photographerUsername}/albums`);

  // Update localAlbums when the albums prop changes
  useEffect(() => {
    setLocalAlbums(albums);
  }, [albums]);

  // Filter
  const filteredAlbums = useMemo(() => {
    if (!searchQuery) return localAlbums;
    const lowerQuery = searchQuery.toLowerCase();
    return localAlbums.filter((album) =>
      album.title.toLowerCase().includes(lowerQuery)
    );
  }, [localAlbums, searchQuery]);

  // Creating
  const handleAlbumCreated = (newAlbum) => {
    if (!newAlbum || !newAlbum.id || !newAlbum.slug) {
      console.error('New album is missing required fields:', newAlbum);
      return;
    }
    setLocalAlbums((prev) => [...prev, newAlbum]);
    router.push(`/${photographerUsername}/albums/${newAlbum.slug}`);
  };

  // Top button:
  const TopButton = () => {
    if (isProfilePage) {
      return null; 
    }
    if (isAlbumsIndex || isSingleAlbumPage) {
      return (
        <button
          type="button"
          onClick={() => router.push(`/${photographerUsername}`)}
          className="back-button"
        >
          Profile
        </button>
      );
    }
    return (
      <button type="button" onClick={() => router.back()} className="back-button">
        Back
      </button>
    );
  };

  // Debug
  useEffect(() => {
    console.log('AlbumSidebar debug =>', {
      isOwner,
      albumSlug,
      isAlbumsIndex,
      isSingleAlbumPage,
      asPath,
    });
  }, [isOwner, albumSlug, isAlbumsIndex, isSingleAlbumPage, asPath]);

  return (
    <div className="sidebar-container sub-sidebar">
      <TopButton />

      {/* Show "Create Album" if owner and on any album route */}
      {isOwner && (isAlbumsIndex || isSingleAlbumPage) && (
        <button
          onClick={() => setShowCreateModal(true)}
          className="create-album-btn"
        >
          <span>Create Album</span>
          <AddRoundedIcon />
        </button>
      )}

      {/* Search bar if single album */}
      {isSingleAlbumPage && (
        <div className="albumsidebar-search-bar">
          <input
            type="text"
            placeholder="Search Albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      <ul>
        {/* If user is not the owner and not on album routes, show "Profile" */}
        {!isOwner && !isOnAlbumRoutes && (
          <li>
            <Link
              href={`/${photographerUsername}`}
              passHref
              className={`sub-item ${isProfilePage ? 'active' : ''}`}
            >
              Profile
            </Link>
          </li>
        )}

        {/* All Albums link => Clears the search query */}
        <li>
          <Link
            href={`/${photographerUsername}/albums`}
            passHref
            className={`sub-item ${isAlbumsIndex ? 'active' : ''}`}
            onClick={() => setSearchQuery('')}
          >
            All Albums
          </Link>
        </li>

        {/* Filtered albums */}
        {filteredAlbums.map((album) => (
          <li key={album.id}>
            <Link
              href={`/${photographerUsername}/albums/${album.slug}`}
              passHref
              className={`sub-item ${
                albumSlug === album.slug ? 'active' : ''
              }`}
            >
              {album.title}
            </Link>
          </li>
        ))}
      </ul>

      {/* CreateAlbumModal if owner */}
      {isOwner && (
        <CreateAlbumModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onAlbumCreated={handleAlbumCreated}
          photographerUsername={photographerUsername}
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