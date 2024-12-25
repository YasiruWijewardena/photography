// components/AlbumList.js

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AlbumList({ albums, photographs }) {
  return (
    <div className="album-list">
      {albums.map((album) => (
        <div key={album.id} className="album">
          <h3>{album.title}</h3>
          
          {/* Render photographs only if 'photographs' prop is provided */}
          {photographs ? (
            <div className="album-photos">
              {photographs
                .filter((photo) => photo.album_id === album.id)
                .map((photo) => (
                  <img key={photo.id} src={photo.thumbnail_url} alt={photo.title} />
                ))}
            </div>
          ) : (
            // Display cover photo if available
            album.cover_photo_url ? (
              <Image 
                src={album.cover_photo_url} 
                alt={`${album.title} Cover`} 
                width={300} 
                height={200} 
                objectFit="cover" 
              />
            ) : (
              <p>No photographs available.</p>
            )
          )}
          
          <Link href={`/photographer/${album.photographer_id}/albums/${album.id}`}>
            View Album
          </Link>
        </div>
      ))}

      <style jsx>{`
        .album-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .album {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 10px;
          text-align: center;
        }
        .album-photos img {
          width: 100%;
          height: auto;
          margin-bottom: 10px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
