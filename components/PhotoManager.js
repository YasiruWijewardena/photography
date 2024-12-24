// // components/PhotoManager.js
// import { useState, useEffect } from 'react';

// export default function PhotoManager({ albumId, photos, onPhotosChanged }) {
//   const [newFiles, setNewFiles] = useState([]);
//   const [allAlbums, setAllAlbums] = useState([]);
//   const [movePhotoId, setMovePhotoId] = useState(null);
//   const [targetAlbumId, setTargetAlbumId] = useState(null);

//   useEffect(() => {
//     // Fetch all albums for the move functionality
//     fetch('/api/albums')
//       .then(res => res.json())
//       .then(data => setAllAlbums(data.albums || []));
//   }, []);

//   const handleAddPhotos = async () => {
//     if (newFiles.length === 0) return;
//     const formData = new FormData();
//     formData.append('albumId', albumId);
//     newFiles.forEach(file => formData.append('images', file));
//     const res = await fetch('/api/photos/add', {
//       method: 'POST',
//       body: formData
//     });
//     if (res.ok) {
//       onPhotosChanged();
//       setNewFiles([]);
//     } else {
//       alert('Error adding photos');
//     }
//   };

//   const handleDeletePhoto = async (photoId) => {
//     const res = await fetch('/api/photos/delete', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ photoId })
//     });
//     if (res.ok) {
//       onPhotosChanged();
//     } else {
//       alert('Error deleting photo');
//     }
//   };

//   const handleMovePhoto = async (photoId, targetAlbumId) => {
//     const res = await fetch('/api/photos/move', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ photoId, targetAlbumId })
//     });
//     if (res.ok) {
//       onPhotosChanged();
//       setMovePhotoId(null);
//       setTargetAlbumId(null);
//     } else {
//       alert('Error moving photo');
//     }
//   };

//   return (
//     <div>
//       <h3>Photos in this Album</h3>
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
//         {photos.map(photo => (
//           <div key={photo.id} style={{ border: '1px solid #ccc', padding: '10px', width: '150px' }}>
//             <img src={photo.thumb_url} alt={photo.title} style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }} />
//             <p style={{ margin: '5px 0' }}>{photo.title}</p>
//             <button onClick={() => handleDeletePhoto(photo.id)} style={{ marginRight: '5px' }}>Delete</button>
//             <button onClick={() => setMovePhotoId(photo.id)}>Move</button>
//           </div>
//         ))}
//       </div>

//       {movePhotoId && (
//         <div style={{ marginBottom: '20px' }}>
//           <h4>Move Photo</h4>
//           <select value={targetAlbumId || ''} onChange={e => setTargetAlbumId(parseInt(e.target.value))}>
//             <option value="">Select target album</option>
//             {allAlbums.filter(a => a.id !== albumId).map(album => (
//               <option key={album.id} value={album.id}>{album.title}</option>
//             ))}
//           </select>
//           <button 
//             onClick={() => {
//               if (targetAlbumId) {
//                 handleMovePhoto(movePhotoId, targetAlbumId);
//               } else {
//                 alert('Please select an album to move to.');
//               }
//             }}
//             style={{ marginLeft: '10px' }}
//           >
//             Confirm Move
//           </button>
//           <button onClick={() => { setMovePhotoId(null); setTargetAlbumId(null); }} style={{ marginLeft: '10px' }}>
//             Cancel
//           </button>
//         </div>
//       )}

//       <h4>Add New Photos</h4>
//       <input type="file" multiple onChange={e => setNewFiles(Array.from(e.target.files))} style={{ marginBottom: '10px' }} />
//       <br />
//       <button onClick={handleAddPhotos}>Upload</button>
//     </div>
//   );
// }

// components/PhotoManager.js

import { useState, useEffect } from 'react';

export default function PhotoManager({ albumId, photos = [], onPhotosChanged, isOwner }) {
  const [newFiles, setNewFiles] = useState([]);
  const [allAlbums, setAllAlbums] = useState([]);
  const [movePhotoId, setMovePhotoId] = useState(null);
  const [targetAlbumId, setTargetAlbumId] = useState(null);
  const [loadingAvailableAlbums, setLoadingAvailableAlbums] = useState(false);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    // Fetch all albums for the move functionality
    if (isOwner) {
      fetch('/api/albums')
        .then(res => res.json())
        .then(data => setAllAlbums(data.albums || []))
        .catch(error => console.error('Error fetching albums:', error));
    }
  }, [isOwner]);

  const handleAddPhotos = async () => {
    if (newFiles.length === 0) return;
    const formData = new FormData();
    formData.append('albumId', albumId);
    newFiles.forEach(file => formData.append('images', file));
    try {
      const res = await fetch('/api/photos/add', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        onPhotosChanged();
        setNewFiles([]);
      } else {
        throw new Error('Failed to add photos');
      }
    } catch (error) {
      console.error('Error adding photos:', error);
      alert('Failed to add photos.');
    }
  };

  const handleDeletePhoto = async (photoId) => {
    const res = await fetch('/api/photos/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoId })
    });
    if (res.ok) {
      onPhotosChanged();
    } else {
      alert('Error deleting photo');
    }
  };

  const handleMovePhoto = async (photoId, targetAlbumId) => {
    const res = await fetch('/api/photos/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoId, targetAlbumId })
    });
    if (res.ok) {
      onPhotosChanged();
      setMovePhotoId(null);
      setTargetAlbumId(null);
    } else {
      alert('Error moving photo');
    }
  };

  return (
    <div>
      {isOwner && (
        <>
          <h4>Add New Photos</h4>
          <input type="file" multiple onChange={e => setNewFiles(Array.from(e.target.files))} style={{ marginBottom: '10px' }} />
          <br />
          <button onClick={handleAddPhotos}>Upload</button>
        </>
      )}

      <h4>Manage Photos</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        {photos.map(photo => (
          <div key={photo.id} style={{ border: '1px solid #ccc', padding: '10px', width: '150px' }}>
            <img src={photo.thumb_url} alt={photo.title} style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }} />
            <p style={{ margin: '5px 0' }}>{photo.title}</p>
            {isOwner && (
              <>
                <button onClick={() => handleDeletePhoto(photo.id)} style={{ marginRight: '5px' }}>Delete</button>
                <button onClick={() => setMovePhotoId(photo.id)}>Move</button>
              </>
            )}
          </div>
        ))}
      </div>

      {isOwner && movePhotoId && (
        <div style={{ marginBottom: '20px' }}>
          <h4>Move Photo</h4>
          <select value={targetAlbumId || ''} onChange={e => setTargetAlbumId(parseInt(e.target.value))}>
            <option value="">Select target album</option>
            {allAlbums.filter(a => a.id !== albumId).map(album => (
              <option key={album.id} value={album.id}>{album.title}</option>
            ))}
          </select>
          <button 
            onClick={() => {
              if (targetAlbumId) {
                handleMovePhoto(movePhotoId, targetAlbumId);
              } else {
                alert('Please select an album to move to.');
              }
            }}
            style={{ marginLeft: '10px' }}
          >
            Confirm Move
          </button>
          <button onClick={() => { setMovePhotoId(null); setTargetAlbumId(null); }} style={{ marginLeft: '10px' }}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
