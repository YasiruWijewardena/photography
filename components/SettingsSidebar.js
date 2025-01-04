// components/SettingsSidebar.js
// import Link from 'next/link';
// import { useRouter } from 'next/router';
// import '../styles/public/photographerLayout.css'; 

// export default function SettingsSidebar() {
//     const router = useRouter();
//     const path = router.pathname;
//   return (
//     <div className='sidebar-container'>
//         <button onClick={() => router.push('/photographer/dashboard')} className='back-button'>← Back</button>
//       <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
//         <li style={{ marginBottom: '10px' }}>
//           <Link href="/photographer/settings">General Settings</Link>
//         </li>
//         {/* Add more if needed */}
//       </ul>
//     </div>
//   );
// }


// components/SettingsSidebar.js

import Link from 'next/link';
import { useRouter } from 'next/router';
import '../styles/public/photographerLayout.css'; 

export default function SettingsSidebar({ photographerUsername }) {
    const router = useRouter();
    const path = router.pathname;
  return (
    <div className='sidebar-container'>
        <button onClick={() => router.push(`/${photographerUsername}`)} className='back-button'>← Back</button>
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        <li style={{ marginBottom: '10px' }}>
          <Link href={`/${photographerUsername}/settings/general`} className="sidebar-link">General Settings</Link>
        </li>
        {/* Add more settings links if needed */}
      </ul>
      
    </div>
  );
}
