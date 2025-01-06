// pages/404.js

import Link from 'next/link';
import Image from 'next/image';
import '../styles/public/404.css';

export default function Custom404() {
  return (
    <div className='not-found-page'>
    <Image
        src="/404.gif" 
        alt="404 Illustration"
        width={300}
        height={400}
        className='not-found-img'
      />
      <h1>Cannot find the page you are looking for</h1>
      <Link href="/" className='not-found-btn'>
        Go Back Home
      </Link>
    </div>
  );
}