// components/CustomerSidebar.js
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function CustomerSidebar({ username }) {
  const router = useRouter();
  const { asPath } = router; // Use asPath for better matching
  const [isFavouritesOpen, setIsFavouritesOpen] = useState(false);

  useEffect(() => {
    // Automatically open Favourites sub-menu if a sub-route is active
    if (asPath.startsWith(`/customer/${username}/favourites`)) {
      setIsFavouritesOpen(true);
    } else {
      setIsFavouritesOpen(false);
    }
  }, [asPath, username]);

  const navigateToFavourites = () => {
    router.push(`/customer/${username}/favourites/albums`);
  };


  return (
    <div className="sidebar-container customer-sidebar">
      {/* Top button */}
      <button type="button" onClick={() => router.back()} className="back-button">
        Back
      </button>

      <ul>
        <li className={`sub-item ${asPath === `/customer/${username}` ? 'active' : ''}`}>
          <Link href={`/customer/${username}`}>
            <span>Profile</span>
          </Link>
        </li>

        {/* Favourites with Sub-Items */}
        <li className={`sub-item have-children ${asPath.startsWith(`/customer/${username}/favourites`) ? 'active' : ''}`}>
          <button type="button" onClick={navigateToFavourites} className="favourites-button">
            Favourites
          </button>
          
        </li>

        {isFavouritesOpen && (
          <>
            <li className={`sub-item sub-sub-item ${asPath === `/customer/${username}/favourites/albums` ? 'active' : ''}`}>
              <Link href={`/customer/${username}/favourites/albums`}>
                <span>Albums</span>
              </Link>
            </li>

            <li className={`sub-item sub-sub-item ${asPath === `/customer/${username}/favourites/photos` ? 'active' : ''}`}>
              <Link href={`/customer/${username}/favourites/photos`}>
                <span>Photos</span>
              </Link>
            </li>
          </>
        )}

        <li className={`sub-item ${asPath === `/customer/${username}/settings` ? 'active' : ''}`}>
          <Link href={`/customer/${username}/settings`}>
            <span>Settings</span>
          </Link>
        </li>
      </ul>

     
    </div>
  );
}

CustomerSidebar.propTypes = {
  username: PropTypes.string.isRequired,
};