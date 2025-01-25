// components/Footer.js
import Link from 'next/link';
import '../styles/public/footer.css';

export default function Footer() {
  return (
    <footer>
      <div className='footer-items-container'>
        <div>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className='socials'>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
        </div>
      </div>
     
      <p className='copyrights'>&copy; {new Date().getFullYear()} PhotoExplore. All rights reserved.</p>
    </footer>
  );
}
