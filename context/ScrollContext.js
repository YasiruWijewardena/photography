// context/ScrollContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { throttle } from '../utils/throttle'; // Import the throttle utility

// Create the ScrollContext
const ScrollContext = createContext();

// ScrollProvider component
export const ScrollProvider = ({ children }) => {
  const [scrollInfo, setScrollInfo] = useState({
    scrollY: 0,
    source: 'window', // 'window' or 'div'
  });

  // Throttled function to update scroll information
  const throttledUpdateScroll = throttle((scrollY, source) => {
    setScrollInfo({ scrollY, source });
  }, 200); // Throttle limit in milliseconds

  // Listen to window scroll events
  useEffect(() => {
    const handleWindowScroll = () => {
      const currentScrollY = window.scrollY;
      throttledUpdateScroll(currentScrollY, 'window');
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, []);

  return (
    <ScrollContext.Provider value={{ scrollInfo, throttledUpdateScroll }}>
      {children}
    </ScrollContext.Provider>
  );
};

// Custom hook to use the ScrollContext
export const useScrollContext = () => useContext(ScrollContext);