// components/PublicProfile.js

import Image from 'next/image';
import Link from 'next/link';
import { usePhotos } from '../context/PhotoContext';
import { useSession } from 'next-auth/react';
import { IconButton } from '@mui/material';
import { Favorite, FavoriteBorder, Bookmark, BookmarkBorder } from '@mui/icons-material';
import { useState } from 'react';
import PhotoModal from './PhotoModal'; // Ensure this component exists

export default function PublicProfile({ photographerData }) {
  const { toggleLike, toggleFavourite } = usePhotos();
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  const openModal = (images, index) => {
    // Corrected property access
    if (!images[index].photographer_id) {
      console.error('Photographer ID is undefined for this image.');
      return;
    }
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
        <Image
          src={photographerData.profile_picture || '/default-profile.png'}
          alt={`${photographerData.name}'s profile picture`}
          width={150}
          height={150}
          className="photographer-profile-picture"
        />
        <h2>{photographerData.name}</h2>
        <p>{photographerData.bio}</p>
        <p>
          Website:{' '}
          <a href={photographerData.website} target="_blank" rel="noopener noreferrer">
            {photographerData.website}
          </a>
        </p>
        <p>
          Instagram:{' '}
          <a
            href={`https://instagram.com/${photographerData.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            @{photographerData.instagram}
          </a>
        </p>
      </div>

      {/* Albums */}
      <div className="photographer-albums">
        <h3>Albums</h3>
        <div className="albums-grid">
          {photographerData.albums.map((album) => (
            <Link key={album.id} href={`/photographer/${photographerData.id}/albums/${album.id}`} className="album-card">
              
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

      <style jsx>{`
        .public-profile {
          padding: 20px;
        }
        .photographer-info {
          text-align: center;
          margin-bottom: 40px;
        }
        .photographer-profile-picture {
          border-radius: 50%;
        }
        .photographer-albums .albums-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .album-card {
          text-decoration: none;
          color: inherit;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          transition: box-shadow 0.3s;
        }
        .album-card:hover {
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
        }
        .album-cover {
          object-fit: cover;
        }
        .album-card h4 {
          padding: 10px;
        }
      `}</style>
    </div>
  );
}

