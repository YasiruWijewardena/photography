// pages/photographer/portfolio.js

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import PhotographerLayout from '../../components/PhotographerLayout';

export default function Portfolio() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [loadingAlbums, setLoadingAlbums] = useState(false);

  // Fetch albums on component mount and when needed
  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    setLoadingAlbums(true);
    try {
      const res = await axios.get('/api/albums');
      setAlbums(res.data);
    } catch (error) {
      console.error('Error fetching albums:', error);
      alert('Failed to fetch albums.');
    } finally {
      setLoadingAlbums(false);
    }
  };

  const handleUploadSuccess = () => {
    // Refresh albums to include newly uploaded photographs
    fetchAlbums();
  };

  return (
    <div className="portfolio-content">
      <h1>Portfolio</h1>
      <button onClick={() => setIsModalOpen(true)}>Create Album</button>

      <PhotoUploadModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        // No albumId passed, modal is in "Create Album and Upload Photos" mode
      />

      <div className="albums-section">
        {loadingAlbums ? (
          <p>Loading albums...</p>
        ) : albums.length === 0 ? (
          <p>No albums found. Create one to showcase your photographs.</p>
        ) : (
          <div className="albums-grid">
            {albums.map((album) => (
              <Link key={album.id} href={`/photographer/album/${album.id}`} passHref>
                <div className="album-card" style={{ cursor: 'pointer' }}>
                  {album.photographs.length > 0 ? (
                    <Image
                      src={album.photographs[0].image_url}
                      alt={album.title}
                      width={300}
                      height={200}
                      objectFit="cover"
                    />
                  ) : (
                    <div style={{ width: '300px', height: '200px', backgroundColor: '#ccc' }}>
                      {/* Placeholder for albums without photos */}
                      <p>No Cover Photo</p>
                    </div>
                  )}
                  <h3>{album.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Assigning the layout using getLayout
Portfolio.getLayout = function getLayout(page) {
  return <PhotographerLayout>{page}</PhotographerLayout>;
};
