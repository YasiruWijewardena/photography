// components/PublicLayout.js

import Navbar from './Navbar';
import '../styles/navbar.css';

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
