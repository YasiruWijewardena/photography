// pages/albums.js

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import '../styles/public/albums.css';
import PublicLayout from '../components/PublicLayout';
import '../styles/public/global.css';
import '../styles/public/home.css';
import PhotoModal from '../components/PhotoModal'; // Import PhotoModal
import { usePhotos } from '../context/PhotoContext'; // Ensure PhotoContext is available

export default function Albums({ albums }) {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Handler to open modal with specific album photos
  const openModal = (images, index) => {
    setModalImages(images);
    setCurrentPhotoIndex(index);
    setIsModalOpen(true);
  };

  // Handler to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalImages([]);
    setCurrentPhotoIndex(0);
  };

  return (
    <PublicLayout>
      <div className='albums-page'>
        <h1 className='albums-page-title'>Discover Albums</h1>
        <div className='public-albums-wrapper'>
          {albums.map((album) => (
            <div key={album.id} className='public-album-container'>
              {/* Photographer Info */}
              <div className='album-detail-container'>
                <div className='photographer-detail-container'> 
                <Image
                    src={album.photographer?.profile_picture || '/default-profile.png'}
                    alt={album.photographer
                      ? `${album.photographer.name}`
                      : 'Unknown Photographer'}
                    width={100}
                    height={100}
                    className='photographer-pro-pic'
                  />
                  <h3>
                    {album.photographer ? album.photographer.name : 'Unknown Photographer'}
                  </h3>
                </div>
                
                {/* Album Details */}
                <div>
                  <h2>{album.title}</h2>
                  <p>{album.description}</p>
                </div>

                {/* View Album Link */}
                <Link href={`/${album.photographer?.username}/albums/${album.slug}`} className='album-link'>
                  View in profile
                </Link>
              </div>

              {/* Image Slider */}
              {album.photographs.length > 0 && (
                <Swiper
                  spaceBetween={10}
                  slidesPerView={4}
                  navigation
                  pagination={{ clickable: true }}
                  className='album-slider'
                >
                  {album.photographs.map((photo, index) => (
                    <SwiperSlide key={photo.id}>
                      <div 
                        className='photo-thumbnail-container'
                        onClick={() => openModal(album.photographs, index)}
                        style={{ cursor: 'pointer' }}
                        aria-label={`View ${photo.title || 'Photo'}`}
                      >
                        <Image
                          src={photo.thumbnail_url}
                          alt={photo.title || 'Album Image'}
                          width={300}
                          height={200}
                          layout="responsive"
                          objectFit="cover"
                          placeholder="blur"
                          blurDataURL={photo.thumbnail_url}
                          className='album-photo-thumbnail'
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          ))}
        </div>

        {/* Photo Modal */}
        <PhotoModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          images={modalImages}
          startIndex={currentPhotoIndex}
        />
      </div>
    </PublicLayout>
  );
}

// Fetch data at build time
export async function getStaticProps() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/public/albums`);
  if (!res.ok) {
    console.error('Failed to fetch albums');
    return {
      props: {
        albums: [],
      },
      revalidate: 60, // Revalidate every 60 seconds
    };
  }

  const data = await res.json();

  return {
    props: {
      albums: data.albums || [],
    },
    revalidate: 60, // Revalidate every 60 seconds
  };
}