// components/Navbar.js

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef  } from 'react';
import CollectionsRoundedIcon from '@mui/icons-material/CollectionsRounded';
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';
import Image from 'next/image';
import { useScrollContext } from '../context/ScrollContext';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { scrollInfo } = useScrollContext(); 

  // State to control Navbar visibility
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hasShadow, setHasShadow] = useState(false);
  
  // States to control mobile dropdown menu and animation
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [dropdownAnimation, setDropdownAnimation] = useState('');

  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const currentScrollY = scrollInfo.scrollY;

    // Compare current scroll with the last scroll stored in ref
    if (currentScrollY > lastScrollYRef.current && currentScrollY > 50) {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }

    setHasShadow(currentScrollY > 0);
    // Update the ref with the current scroll position
    lastScrollYRef.current = currentScrollY;
  }, [scrollInfo.scrollY]);

  const openDropdown = () => {
    setIsDropdownVisible(true);
    setDropdownAnimation('slideDown');
  };

  const closeDropdown = () => {
    setDropdownAnimation('slideUp');
    // Remove the dropdown after the animation duration (300ms)
    setTimeout(() => {
      setIsDropdownVisible(false);
      setDropdownAnimation('');
    }, 300);
  };

  // Toggle function for mobile dropdown
  const toggleDropdown = () => {
    if (!isDropdownVisible) {
      openDropdown();
    } else {
      closeDropdown();
    }
  };

  return (
    <>
      <nav
        className={`navbar ${showNavbar ? 'navbar-visible' : 'navbar-hidden'} ${hasShadow ? 'navbar-shadow' : ''}`}>
        <div className="navbar-container">
          <div className='navbar-left'>
            {/* Logo */}
            <Link href="/" className="navbar-logo">
              Logo
            </Link>

            {/* Desktop Menu Items */}
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
                  {session.user.profile_picture ? (
                    <>
                      <Image
                        src={session.user.profile_picture}
                        alt={`${session.user.firstname}'s Profile Picture`}
                        width={32}
                        height={32}
                        className="nav-bar-profile-picture"
                      />

                      <div className='only-mobile'>
                      {!isDropdownVisible ? (
                        <KeyboardArrowDownIcon onClick={toggleDropdown} style={{ cursor: 'pointer' }} className='nav-bar-arrow-down'/>
                      ) : (
                        <KeyboardArrowDownIcon onClick={toggleDropdown} style={{ cursor: 'pointer' }} className='nav-bar-arrow-up'/>
                      )}
                    </div>
                    </>
                   

                  ) : (
                    <PersonIcon className="icon mr-2" />
                  )}
                  <span className='navbar-profil-text'>Hello, {session.user.firstname}</span>
                </Link>
              ) : (
                <span className="navbar-item">Hello, {session.user.firstname}</span>
              )
            ) : (
              <>
                <div className='login-options only-desktop'>
                  <Link href="/login" className="navbar-item">
                    Login
                  </Link>
                  <Link href="/join-as-a-photographer" className="navbar-item navbar-button">
                    Join as a Photographer
                  </Link>
                </div>

                {/* Mobile arrow for dropdown */}
                <div className='only-mobile'>
                  {!isDropdownVisible ? (
                    <Link href="/join-as-a-photographer" className="navbar-item navbar-button">
                      Join as a Photographer
                    </Link>
                  ): (
                    <Link href="/join-as-a-photographer" className="navbar-item navbar-button navbar-button-hidden">
                      Join as a Photographer
                    </Link>
                  )}
                  
                  {!isDropdownVisible ? (
                    <KeyboardArrowDownIcon onClick={toggleDropdown} style={{ cursor: 'pointer' }} className='nav-bar-arrow-down'/>
                  ) : (
                    <KeyboardArrowDownIcon onClick={toggleDropdown} style={{ cursor: 'pointer' }} className='nav-bar-arrow-up'/>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isDropdownVisible && (
        <div className={`dropdown-menu only-mobile-dropdown ${dropdownAnimation}`}>
          <Link href="/albums" className="dropdown-item" onClick={closeDropdown}>
            <CollectionsRoundedIcon className="icon" />
            <span className='navbar-item-text'>Albums</span>
          </Link>
          <Link href="/photographers" className="dropdown-item" onClick={closeDropdown}>
            <PersonIcon className="icon" />
            <span className='navbar-item-text'>Photographers</span>
          </Link>
          <Link href="/about-us" className="dropdown-item" onClick={closeDropdown}>
            <InfoIcon className="icon" />
            <span className='navbar-item-text'>About Us</span>
          </Link>

        {!session && (
          <div className="login-options-mobile">
          <Link href="/login" className="dropdown-item" onClick={closeDropdown}>
            Login
          </Link>
          <Link href="/join-as-a-photographer" className="dropdown-item navbar-button" onClick={closeDropdown}>
            Join as a Photographer
          </Link>
        </div>
        )}
          
        </div>
      )}
    </>
  );
}