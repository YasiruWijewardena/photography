// // components/CreateAlbumModal.js

// import { useState, useEffect } from 'react';
// import Modal from 'react-modal';
// import { useDropzone } from 'react-dropzone';
// import axios from 'axios';

// export default function CreateAlbumModal({ isOpen, onClose, onAlbumCreated }) {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [files, setFiles] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState('');

//   useEffect(() => {
//     // Fetch categories when modal opens
//     if (isOpen) {
//       axios.get('/api/categories')
//         .then(response => setCategories(response.data.categories))
//         .catch(error => console.error('Error fetching categories:', error));
//     }
//   }, [isOpen]);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     accept: { 'image/*': [] },
//     onDrop: (acceptedFiles) => {
//       const mappedFiles = acceptedFiles.map(file => Object.assign(file, {
//         preview: URL.createObjectURL(file)
//       }));
//       setFiles((prev) => [...prev, ...mappedFiles]);
//     },
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!title.trim()) {
//       alert('Please provide a title for the album.');
//       return;
//     }
//     if (!selectedCategory) {
//       alert('Please select a category.');
//       return;
//     }

//     try {
//       const res = await axios.post('/api/albums', { 
//         title, 
//         description, 
//         category_id: parseInt(selectedCategory, 10) // Ensure it's an integer
//       });

//       const albumId = res.data.album.id;

//       if (files.length > 0) {
//         const formData = new FormData();
//         formData.append('albumId', albumId);
//         files.forEach((file) => formData.append('images', file));
//         await axios.post('/api/photographs/add', formData);
//       }

//       onAlbumCreated();
//       setTitle('');
//       setDescription('');
//       setFiles([]);
//       setSelectedCategory('');
//       onClose();
//     } catch (error) {
//       console.error('Error creating album:', error);
//       alert('Failed to create album.');
//     }
//   };

//   const handleRemoveFile = (file) => {
//     setFiles(files.filter(f => f !== file));
//     URL.revokeObjectURL(file.preview);
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onClose}
//       contentLabel="Create New Album"
//       className={{
//         base: 'modal-content',
//         afterOpen: 'modal-content--after-open',
//         beforeClose: 'modal-content--before-close',
//       }}
//       overlayClassName={{
//         base: 'modal-overlay',
//         afterOpen: 'modal-overlay--after-open',
//         beforeClose: 'modal-overlay--before-close',
//       }}
//       closeTimeoutMS={300}
//     >
//       {/* Close Button */}
//       <button onClick={onClose} className="modal-close-button">
//         &times;
//       </button>

//       <h2 className='modal-titles'>Create New Album</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Album Title:</label>
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label>Description:</label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           ></textarea>
//         </div>
//         <div className="form-group">
//           <label>Category:</label>
//           <select
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//             required
//           >
//             <option value="" disabled>Select a category</option>
//             {categories.map(category => (
//               <option key={category.id} value={category.id}>{category.name}</option>
//             ))}
//           </select>
//         </div>
//         <div
//           {...getRootProps()}
//           className="dropzone"
//         >
//           <input {...getInputProps()} />
//           {isDragActive ? (
//             <p>Drop photos here...</p>
//           ) : (
//             <p>Drag & drop photos here, or click to select files</p>
//           )}
//           {files.length > 0 && <p>{files.length} file(s) selected</p>}
//         </div>

//         {/* Thumbnails */}
//         {files.length > 0 && (
//           <div className="thumbnails">
//             {files.map((file, index) => (
//               <div key={index} className="thumbnail">
//                 <img src={file.preview} alt={file.name} />
//                 <button
//                   type="button"
//                   onClick={() => handleRemoveFile(file)}
//                   className="remove-button"
//                 >
//                   &times;
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}

//         <div className="modal-actions">
//           <button type="submit" className="primary-button">Create Album</button>
//         </div>
//       </form>
//     </Modal>
//   );
// }

// components/CreateAlbumModal.js

import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

export default function CreateAlbumModal({ isOpen, onClose, onAlbumCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    if (isOpen) {
      axios
        .get('/api/categories')
        .then((response) => setCategories(response.data.categories))
        .catch((error) => console.error('Error fetching categories:', error));
    }
  }, [isOpen]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (acceptedFiles) => {
      const mappedFiles = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );
      setFiles((prev) => [...prev, ...mappedFiles]);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please provide a title for the album.');
      return;
    }
    if (!selectedCategory) {
      alert('Please select a category.');
      return;
    }

    try {
      // 1) Create the album
      const res = await axios.post('/api/albums', {
        title,
        description,
        category_id: parseInt(selectedCategory, 10),
      });

      const newAlbum = res.data.album;
      if (!newAlbum || !newAlbum.id) {
        throw new Error('Album creation response missing "album.id"');
      }

      // 2) Upload photos if any
      if (files.length > 0) {
        const formData = new FormData();
        formData.append('albumId', newAlbum.id);
        files.forEach((file) => formData.append('images', file));
        await axios.post('/api/photographs/add', formData);
      }

      // 3) Notify parent about the newly created album
      onAlbumCreated(newAlbum);

      // 4) Reset form, close modal
      setTitle('');
      setDescription('');
      setFiles([]);
      setSelectedCategory('');
      onClose();
    } catch (error) {
      console.error('Error creating album:', error);
      alert('Failed to create album.');
    }
  };

  const handleRemoveFile = (file) => {
    setFiles(files.filter((f) => f !== file));
    URL.revokeObjectURL(file.preview);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Create New Album"
      className={{
                base: 'modal-content',
                afterOpen: 'modal-content--after-open',
                beforeClose: 'modal-content--before-close',
              }}
              overlayClassName={{
                base: 'modal-overlay',
                afterOpen: 'modal-overlay--after-open',
                beforeClose: 'modal-overlay--before-close',
              }}
      closeTimeoutMS={300}
    >
      <button onClick={onClose} className="modal-close-button">
        &times;
      </button>

      <h2 className="modal-titles">Create New Album</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Album Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop photos here...</p>
          ) : (
            <p>Drag &amp; drop photos here, or click to select files</p>
          )}
          {files.length > 0 && <p>{files.length} file(s) selected</p>}
        </div>

        {/* Thumbnails */}
        {files.length > 0 && (
          <div className="thumbnails">
            {files.map((file, index) => (
              <div key={index} className="thumbnail">
                <img src={file.preview} alt={file.name} />
                <button
                  type="button"
                  onClick={() => handleRemoveFile(file)}
                  className="remove-button"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="modal-actions">
          <button type="submit" className="primary-button">
            Create Album
          </button>
        </div>
      </form>
    </Modal>
  );
}