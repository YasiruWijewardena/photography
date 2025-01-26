// components/CustomerLayout.js

import PropTypes from 'prop-types';
import CustomerSidebar from './CustomerSidebar';
import Navbar from './Navbar';
import { useEffect, useState, useRef} from 'react';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'; // Hamburger icon
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'; // Close icon
import '../styles/navbar.css';

export default function CustomerLayout({ children, username }) {

  // For toggling the sidebar in mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Track the scroll direction to hide/show hamburger
  const [scrollDir, setScrollDir] = useState('up'); // or 'down'
  const lastScrollY = useRef(0);

  // Listen for scroll events to set scrollDir = 'down' or 'up'
  const contentRef = useRef(null);

  useEffect(() => {
    const scrollContainer = contentRef.current;
    const THRESHOLD = 20;
  
    if (!scrollContainer) return;
  
    const handleScroll = () => {
      const currentY = scrollContainer.scrollTop;
      if (currentY - lastScrollY.current > THRESHOLD) {
        // scrolled down by > THRESHOLD
        setScrollDir('down');
        lastScrollY.current = currentY;
      } else if (lastScrollY.current - currentY > THRESHOLD) {
        // scrolled up by > THRESHOLD
        setScrollDir('up');
        lastScrollY.current = currentY;
      }
      // If it's within +-5px, do nothing, ignore it
    };
  
    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  // Sidebar open/close
  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
      document.body.classList.add('customer-layout-body');
      return () => {
        document.body.classList.remove('customer-layout-body');
      };
    }, []);

  return (
    <>
      <Navbar/>
      <div className="customer-layout">
      <button
          className={`mobile-hamburger-btn ${scrollDir === 'down' ? 'hide' : ''}`}
          onClick={openSidebar}
          aria-label="Open Sidebar"
        >
          <MenuRoundedIcon />
        </button>
        {/* Overlay if sidebar is open */}
        {isSidebarOpen && (
          <div 
            className="sidebar-overlay"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}
        <aside 
          className={`customer-sidebar-container ${isSidebarOpen ? 'open' : ''}`}
        >
          {/* Close button on mobile */}
          <button
            className="sidebar-close-button"
            onClick={closeSidebar}
            aria-label="Close Sidebar"
          >
            <CloseRoundedIcon />
          </button>
          <CustomerSidebar username={username} />

        </aside>
        
        <main className="customer-main-content" ref={contentRef}>
          {children}
        </main>
      </div>
    </>
    
  );
}

CustomerLayout.propTypes = {
  children: PropTypes.node.isRequired,
  username: PropTypes.string.isRequired,
};