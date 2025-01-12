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

  // Local album list
  const [localAlbums, setLocalAlbums] = useState(albums);

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Search bar state
  const [searchQuery, setSearchQuery] = useState('');

  // Is it the profile page => "/[username]"?
  const isProfilePage = router.pathname === '/[username]';

  // Decide if we’re on the "all albums" vs. "single album"
  // If albumSlug is undefined => all albums page
  // If albumSlug exists => single album page
  const isAlbumsIndex = !albumSlug;     // true means "all albums"
  const isSingleAlbumPage = !!albumSlug; // true means "one specific album"

  // Are we on ANY album route? (i.e. /[username]/albums or /[username]/albums/[slug])
  const isOnAlbumRoutes = router.pathname.startsWith('/[username]/albums');

  // Filter albums by the search query (client-side)
  const filteredAlbums = useMemo(() => {
    if (!searchQuery) return localAlbums;
    const lowerQuery = searchQuery.toLowerCase();
    return localAlbums.filter((album) =>
      album.title.toLowerCase().includes(lowerQuery)
    );
  }, [localAlbums, searchQuery]);

  // Handle album creation
  const handleAlbumCreated = (newAlbum) => {
    if (!newAlbum || !newAlbum.id || !newAlbum.slug) {
      console.error('New album is missing required fields:', newAlbum);
      return;
    }
    setLocalAlbums((prev) => [...prev, newAlbum]);
    // Navigate to the newly created album
    router.push(`/${photographerUsername}/albums/${newAlbum.slug}`);
  };

  /** Decide which top button to show:
   * - If on the profile page, show nothing.
   * - If on the all albums page OR a single album, show "Profile".
   * - Otherwise, show "Back".
   */
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

  useEffect(() => {
    console.log('AlbumSidebar debug =>', {
      isOwner,
      albumSlug,
      isAlbumsIndex,
      isSingleAlbumPage,
      path: router.pathname,
    });
  }, [isOwner, albumSlug, isAlbumsIndex, isSingleAlbumPage, router.pathname]);

  return (
    <div className="sidebar-container sub-sidebar">
      <TopButton />

      {/* Show "Create Album" if owner and on any album route (all or single) */}
      {isOwner && (isAlbumsIndex || isSingleAlbumPage) && (
        <button
          onClick={() => setShowCreateModal(true)}
          className="create-album-btn"
        >
          <span>Create Album</span>
          <AddRoundedIcon />
        </button>
      )}

      {/* Only show the search bar if on a single album */}
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
        {/* If user is not the owner and not on album routes, show "Profile" link */}
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

        {/* All Albums link: clicking it clears the search query */}
        <li>
          <Link
            href={`/${photographerUsername}/albums`}
            passHref
            className={`sub-item ${isAlbumsIndex && !albumSlug ? 'active' : ''}`}
            onClick={() => setSearchQuery('')}
          >
            All Albums
          </Link>
        </li>

        {/* List the filtered albums */}
        {filteredAlbums.map((album) => (
          <li key={album.id}>
            <Link
              href={`/${photographerUsername}/albums/${album.slug}`}
              passHref
              className={`sub-item ${albumSlug === album.slug ? 'active' : ''}`}
            >
              {album.title}
            </Link>
          </li>
        ))}
      </ul>

      {/* Modal for creating new album (owner only) */}
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