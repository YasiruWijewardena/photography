// components/PhotographerFavSidebar.js

import Link from 'next/link';
import { useRouter } from 'next/router';
import '../styles/public/photographerLayout.css'; 

export default function SettingsSidebar({ photographerUsername }) {
    const router = useRouter();
    const path = router.pathname;
    const { asPath } = router; 
  return (
    <div className='sidebar-container'>

      <button type="button" onClick={() => router.push(`/${photographerUsername}`)} className="back-button">
        Profile
      </button>
       
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
       
        <li>
            <Link
              href={`/${photographerUsername}/favourites/albums`}
              passHref
              className={`sub-item ${asPath === `/${photographerUsername}/favourites/albums` ? 'active' : ''}`}
            >
              Albums
            </Link>
        </li>
        <li>
            <Link
              href={`/${photographerUsername}/favourites/photos`}
              passHref
              className={`sub-item ${asPath === `/${photographerUsername}/favourites/photos` ? 'active' : ''}`}
            >
              Photos
            </Link>
        </li>
      </ul>
      
    </div>
  );
}