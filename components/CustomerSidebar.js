// components/CustomerSidebar.js

import Link from 'next/link';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

export default function CustomerSidebar({ username }) {
  const router = useRouter();
  const { pathname } = router;

  return (
    <nav className="customer-sidebar">
      <ul>
        <li className={pathname === `/customer/${username}/favourites` || pathname === `/customer/${username}` ? 'active' : ''}>
          <Link href={`/customer/${username}`}>
            Favourited Albums
          </Link>
        </li>
        <li className={pathname === `/customer/${username}/settings` ? 'active' : ''}>
          <Link href={`/customer/${username}/settings`}>
            Settings
          </Link>
        </li>
      </ul>
      <style jsx>{`
        .customer-sidebar {
          width: 250px;
          background-color: #f5f5f5;
          padding: 20px;
          height: 100vh;
          position: fixed;
        }

        .customer-sidebar ul {
          list-style: none;
          padding: 0;
        }

        .customer-sidebar li {
          margin-bottom: 20px;
        }

        .customer-sidebar a {
          text-decoration: none;
          color: #333;
          font-size: 18px;
        }

        .customer-sidebar .active a {
          font-weight: bold;
          color: #0070f3;
        }
      `}</style>
    </nav>
  );
}

CustomerSidebar.propTypes = {
  username: PropTypes.string.isRequired,
};