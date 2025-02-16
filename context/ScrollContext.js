// context/ScrollContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the ScrollContext
const ScrollContext = createContext();

// ScrollProvider component
export const ScrollProvider = ({ children }) => {
  const [scrollInfo, setScrollInfo] = useState({
    scrollY: 0,
    source: 'window',
  });

  // Throttled function to update scroll information
  const throttledUpdateScroll = (scrollY, source) => {
    setScrollInfo({ scrollY, source });
  }

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