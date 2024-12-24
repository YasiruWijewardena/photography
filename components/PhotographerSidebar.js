// components/PhotographerSidebar.js
// import Link from 'next/link';
// import CollectionsRoundedIcon from '@mui/icons-material/CollectionsRounded';
// import SettingsIcon from '@mui/icons-material/Settings';
// import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

// export default function MainSidebar() {
//   return (
//     <div className='sidebar-container'>
//         <Link href="/" className="sidebar-link-home">
//             <HomeRoundedIcon className="icon" />
//             <span>Home</span>
//           </Link>
//       <ul>
//         <li>
//           <Link href="/photographer/album" className="sidebar-link">
//             <CollectionsRoundedIcon className="icon" />
//             <span>Albums</span>
//           </Link>
//         </li>
//         <li>
//           <Link href="/photographer/settings" className="sidebar-link">
//             <SettingsIcon className="icon" />
//             <span>Settings</span>
//           </Link>
//         </li>
//       </ul>
//     </div>
//   );
// }

// components/PhotographerSidebar.js

import Link from 'next/link';
import CollectionsRoundedIcon from '@mui/icons-material/CollectionsRounded';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

export default function MainSidebar({ photographerId }) {
  return (
    <div className='sidebar-container'>
      <Link href="/" className="sidebar-link-home">
        <HomeRoundedIcon className="icon" />
        <span>Home</span>
      </Link>
      <ul>
        <li>
          <Link href={`/photographer/${photographerId}/albums`} className="sidebar-link">
            <CollectionsRoundedIcon className="icon" />
            <span>Albums</span>
          </Link>
        </li>
        <li>
          <Link href={`/photographer/${photographerId}/settings`} className="sidebar-link">
            <SettingsIcon className="icon" />
            <span>Settings</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

