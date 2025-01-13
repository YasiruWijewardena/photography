// components/CustomerSidebar.js
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

export default function CustomerSidebar({ username }) {
  const router = useRouter();
  const { asPath } = router; // Use asPath for better matching

  return (
    <div className="sidebar-container customer-sidebar">
      {/* Top button */}
      <button type="button" onClick={() => router.back()} className="back-button">
        Back
      </button>

      <ul>
        <li className={`sub-item ${asPath === `/customer/${username}` || asPath === `/customer/${username}/favourites` ? 'active' : ''}`}>
          <Link href={`/customer/${username}`}>
            Favourites
          </Link>
        </li>
        <li className={`sub-item ${asPath === `/customer/${username}/settings` ? 'active' : ''}`}>
          <Link href={`/customer/${username}/settings`}>
            Settings
          </Link>
        </li>
      </ul>
    </div>
  );
}

CustomerSidebar.propTypes = {
  username: PropTypes.string.isRequired,
};