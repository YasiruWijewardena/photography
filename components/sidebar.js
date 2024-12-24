// components/Sidebar.js

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Sidebar() {
  const { data: session } = useSession();
  const router = useRouter();

  const isSuperAdmin = session?.user?.admin_level === 'SUPER';

  const currentPath = router.pathname;

  return (
    <nav className="admin-sidebar">
      <div className="admin-menu">
        <ul>
          {/* Dashboard */}
          <li>
            <Link href="/admin/dashboard" className={`menu-items ${
                  currentPath === '/admin/dashboard' ? 'active' : ''
                }`}>
             
                DASHBOARD
              
            </Link>
          </li>

          {/* Photographers */}
          <li>
            <Link href="/admin/photographers" className={`menu-items ${
                  currentPath.startsWith('/admin/photographers') ? 'active' : ''
                }`}>
              
                PHOTOGRAPHERS
              
            </Link>
          </li>

          {/* Admins */}
          {isSuperAdmin && (
            <li>
              <Link href="/admin/admins"  className={`menu-items ${
                    currentPath.startsWith('/admin/admins') ? 'active' : ''
                  }`}>
                
                  ADMINS
               
              </Link>
            </li>
          )}

          {/* Subscriptions */}
          {isSuperAdmin && (
            <li>
              <Link
                href="/admin/subscriptions"
                className={`menu-items ${
                  currentPath.startsWith('/admin/subscriptions') ? 'active' : ''
                }`}
              >
                SUBSCRIPTIONS
              </Link>
            </li>
          )}
        </ul>
      </div>
      <div className="sidebar-bottom-container">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="admin-secondary-btn"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}
