// components/AlbumList.js

import React from 'react';

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
                  <img key={photo.id} src={photo.thumb_url} alt={photo.title} />
                ))}
            </div>
          ) : (
            // Alternative rendering when 'photographs' is not provided
            <p>No photographs available.</p>
          )}
        </div>
      ))}
    </div>
  );
}

