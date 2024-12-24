// components/Tabs.js

import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Tabs({ tabs }) {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <Link href={tab.href} key={tab.href} className={`tab-item ${
            currentPath === tab.href ? 'active' : ''
          }`}>
          {tab.label}
          
        </Link>
      ))}
    </div>
  );
}
