// components/PhotographerSidebar.js

import Link from 'next/link';
import CollectionsRoundedIcon from '@mui/icons-material/CollectionsRounded';
import SettingsIcon from '@mui/icons-material/Settings';
import PropTypes from 'prop-types';

export default function PhotographerSidebar({ photographerUsername, isOwner }) {
  return (
    <nav className="sidebar-container">
      <ul>
        {/* Albums Link */}
        <li>
          <Link href={`/${photographerUsername}/albums`} passHref className="sidebar-link">
            
              <CollectionsRoundedIcon className="icon" />
              <span>Albums</span>
            
          </Link>
        </li>
        {/* Settings Link */}
        <li>
          <Link href={`/${photographerUsername}/settings`} passHref className="sidebar-link">
            
              <SettingsIcon className="icon" />
              <span>Settings</span>
            
          </Link>
        </li>
        {/* Add more links if you wish */}
      </ul>
    </nav>
  );
}

PhotographerSidebar.propTypes = {
  photographerUsername: PropTypes.string.isRequired,
  isOwner: PropTypes.bool.isRequired,
};