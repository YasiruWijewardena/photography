// components/AlbumView.js

import { useEffect, useState } from 'react';
import PhotoManager from './PhotoManager';

export default function AlbumView({ album, isOwner }) {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetch(`/api/albums/${album.id}`)
      .then(res => res.json())
      .then(data => setPhotos(data.album.photographs || []))
      .catch(error => console.error('Error fetching photographs:', error));
  }, [album]);

  const refreshPhotos = () => {
    fetch(`/api/albums/${album.id}`)
      .then(res => res.json())
      .then(data => setPhotos(data.album.photographs || []))
      .catch(error => console.error('Error refreshing photographs:', error));
  };

  return (
    <div>
      <h2>{album.title}</h2>
      <p>{album.description}</p>
      <PhotoManager albumId={album.id} photos={photos} onPhotosChanged={refreshPhotos} isOwner={isOwner} />
    </div>
  );
}
