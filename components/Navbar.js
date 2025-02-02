// components/Navbar.js

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CollectionsRoundedIcon from '@mui/icons-material/CollectionsRounded';
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';
import Image from 'next/image'; // Import Next.js Image component
import { useScrollContext } from '../context/ScrollContext'; // Import the ScrollContext

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { scrollInfo } = useScrollContext(); 

  // State to control Navbar visibility
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hasShadow, setHasShadow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = scrollInfo.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
    
      setHasShadow(currentScrollY > 0);

      setLastScrollY(currentScrollY);
    }

    handleScroll(); 
  }, [scrollInfo.scrollY]);

  return (
    <nav
    className={`navbar ${showNavbar ? 'navbar-visible' : 'navbar-hidden'} ${hasShadow ? 'navbar-shadow' : ''}`}>
      <div className="navbar-container">
        <div className='navbar-left'>
          {/* Logo */}
          <Link href="/" className="navbar-logo">
            Logo
          </Link>

          {/* Menu Items */}
          <ul className="navbar-menu navbar-menu-desktop-items">
            <li>
              <Link href="/albums" className="navbar-item">
                <CollectionsRoundedIcon className="icon" />
                <span className='navbar-item-text'>Albums</span>
              </Link>
            </li>
            <li>
              <Link href="/photographers" className="navbar-item">
                <PersonIcon className="icon" />
                <span className='navbar-item-text'>Photographers</span>
              </Link>
            </li>
            <li>
              <Link href="/about-us" className="navbar-item">
                <InfoIcon className="icon" />
                <span className='navbar-item-text'>About Us</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className='nav-bar-mobile-items'>
          {/* Menu Items */}
          <ul className="navbar-menu">
            <li>
              <Link href="/albums" className="navbar-item">
                <CollectionsRoundedIcon className="icon" />
                <span className='navbar-item-text'>Albums</span>
              </Link>
            </li>
            <li>
              <Link href="/photographers" className="navbar-item">
                <PersonIcon className="icon" />
                <span className='navbar-item-text'>Photographers</span>
              </Link>
            </li>
            <li>
              <Link href="/about-us" className="navbar-item">
                <InfoIcon className="icon" />
                <span className='navbar-item-text'>About Us</span>
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
                <PersonIcon className="icon" />
                <span className='navbar-profil-text'>Hello, {session.user.firstname}</span>
              </Link>
            ) : session.user.role === 'photographer' ? (
              <Link href={`/${session.user.username}`} className="navbar-item flex items-center">
                {/* Display profile picture if available */}
                {session.user.profile_picture ? (
                  <Image
                    src={session.user.profile_picture}
                    alt={`${session.user.firstname}'s Profile Picture`}
                    width={32}
                    height={32}
                    className="nav-bar-profile-picture"
                  />
                ) : (
                  // Fallback icon if no profile picture
                  <PersonIcon className="icon mr-2" />
                )}
                <span className='navbar-profil-text'>Hello, {session.user.firstname}</span>
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
            </>
          )}
        </div>
      </div>
    </nav>
  );
}