// pages/index.js

import PublicLayout from '../components/PublicLayout';
import '../styles/public/global.css';
import '../styles/public/home.css';


import Hero from '../components/Hero';
//import TopAlbums from '../components/TopAlbums';
import PhotoSection from '../components/PhotoSection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <PublicLayout>
      <Hero />
      <PhotoSection scope="home" enableFilters={true} />
      <Footer />
    </PublicLayout>
  );
}
