// components/Navbar.js

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          Logo
        </Link>

        {/* Menu Items */}
        <ul className="navbar-menu">
          <li>
            <Link href="/explore" className="navbar-item">
              Explore
            </Link>
          </li>
          <li>
            <Link href="/about-us" className="navbar-item">
              About Us
            </Link>
          </li>
          <li>
            <Link href="/contact-us" className="navbar-item">
               Contact Us
            </Link>
          </li>
        </ul>

        <div className="navbar-auth">
          {session ? (
            session.user.role === 'customer' ? (
              <Link href="/customer/profile" className="navbar-item">
                Hello, {session.user.firstname}
              </Link>
            ) : session.user.role === 'photographer' ? (
              <Link href={`/photographer/${session.user.id}`} className="navbar-item">
                Hello, {session.user.firstname}
              </Link>
            ) : (
              // If logged in but neither customer nor photographer
              <span className="navbar-item">Hello, {session.user.firstname}</span>
            )
          ) : (
            <>
              <Link href="/login" className="navbar-item">
                Login
              </Link>
              <Link href="/signup" className="navbar-item navbar-signup">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
