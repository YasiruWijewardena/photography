// components/Navbar.js

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className='navbar-left'>
          {/* Logo */}
          <Link href="/" className="navbar-logo">
            Logo
          </Link>

          {/* Menu Items */}
          <ul className="navbar-menu">
            <li>
              <Link href="/albums" className="navbar-item">
                Albums
              </Link>
            </li>
            <li>
              <Link href="/photographers" className="navbar-item">
                Photographers
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
        </div>
        

        <div className="navbar-auth">
          {status === 'loading' ? (
            <span className="navbar-item">Loading...</span>
          ) : session ? (
            // Check for pending role or incomplete data
            session.user.role === 'pending' ||
            (session.user.role === 'photographer' && !session.user.photographer_id) ? (
              <Link href="/signup" className="navbar-item">
                Complete Your Signup, {session.user.firstname}
              </Link>
            ) : session.user.role === 'customer' ? (
              <Link href={`/customer/${session.user.username}`} className="navbar-item">
                Hello, {session.user.firstname}
              </Link>
            ) : session.user.role === 'photographer' ? (
              <Link href={`/${session.user.username}`} className="navbar-item">
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