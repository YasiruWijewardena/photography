// components/PublicProfile.js

import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import PhotoModal from './PhotoModal'; 
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import PhoneIphoneRoundedIcon from '@mui/icons-material/PhoneIphoneRounded';

export default function PublicProfile({ photographerData }) {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  const isOwner = session?.user?.role === 'photographer' && session.user.id === photographerData.id;

  const openModal = (images, index) => {
    setSelectedImages(images);
    setStartIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="public-profile">
      {/* Photographer Info */}
      <div className="photographer-info">
        <div className='profile-img-container'>
          <Image
            src={photographerData.profile_picture || '/default-profile.png'}
            alt={`${photographerData.name}'s profile picture`}
            width={150}
            height={150}
            className="photographer-profile-picture"
          />
        </div>
        <div className='info-container'>
          <h2>{photographerData.name}</h2>
          <p>{photographerData.bio}</p>
          
        </div>
       
        
        

        {/* Owner-Specific Actions */}
        {/* {isOwner && (
          <div className="owner-actions">
            <Link href={`/photographer/${photographerData.id}/settings`}>
              Edit Profile
            </Link>
            <Link href={`/photographer/${photographerData.id}/albums`}>
              Manage Albums
            </Link>
          </div>
        )} */}
      </div>
      {/* <div className='contact-info-container'>
          <div>
              <LanguageRoundedIcon className='icon'/>
              <a href={photographerData.website} target="_blank" rel="noopener noreferrer">
                {photographerData.website}
              </a>
            </div>
            <div>
              <CameraAltRoundedIcon className='icon'/>
              <a
                href={`https://instagram.com/${photographerData.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                @{photographerData.instagram}
              </a>
            </div>
            <div>
              <PhoneIphoneRoundedIcon className='icon'/>
              <a
                href={`https://instagram.com/${photographerData.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {photographerData.mobile_num}
              </a>
            </div>
        </div> */}
      {/* Albums */}
      <div className="photographer-albums">
        <div className="albums-grid">
          {photographerData.albums.map((album) => (
            <Link key={album.id} href={`/${photographerData.username}/albums/${album.slug}`} className="album-card">
              
                <Image
                  src={album.cover_photo_url || '/default-album.png'}
                  alt={album.title}
                  width={300}
                  height={200}
                  className="album-cover"
                />
                <h4>{album.title}</h4>
              
            </Link>
          ))}
        </div>
      </div>

      {/* Modal for viewing photos */}
      <PhotoModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        images={selectedImages}
        startIndex={startIndex}
      />
    </div>
  );
}
