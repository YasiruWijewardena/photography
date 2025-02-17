// pages/join-as-a-photographer.js

import Link from 'next/link';
import Image from 'next/image';
import '../styles/public/join-photographer.css';
import PublicLayout from '../components/PublicLayout';
import Footer from '../components/Footer';

export default function JoinAsAPhotographer() {
  return (
    <PublicLayout>
        <div className='join-photographer-page'>
            <h1 className='join-photographer-title'>Discover priceless Opportunities</h1>
            <div className='join-now-button-container'>
            <Link href="/signup?role=photographer" className="join-now-button">
              Join now
            </Link>
            </div>
            
            <p className='join-photographer-desc'>Showcase your best shots and impress potential clients with stunning albums! </p>
            <p className='join-photographer-desc'>Give your clients a dedicated portal to access and relive their memories online—all in one seamless platform built for photographers like you.</p>
        </div>
        <Footer />
    </PublicLayout>
   
  );
}