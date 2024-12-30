// components/CreateAlbumModal.js

import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import PropTypes from 'prop-types';

export default function CreateAlbumModal({ isOpen, onClose, onAlbumCreated, photographerUsername }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);

    try {
      // 1) Create the album
      const res = await axios.post('/api/albums', {
        title,
        description,
        category_id: parseInt(selectedCategory, 10),
      });

      const newAlbum = res.data.album;
      if (!newAlbum || !newAlbum.id || !newAlbum.slug) {
        throw new Error('Album creation response missing required fields.');
      }

      // 2) Upload photos if any
      if (files.length > 0) {
        const formData = new FormData();
        formData.append('albumId', newAlbum.id);
        files.forEach((file) => formData.append('images', file));
        await axios.post('/api/photographs/add', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
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
      alert('Failed to create album. Please try again.');
    } finally {
      setIsSubmitting(false);
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
      ariaHideApp={false} // Set to true and bind modal to appElement for accessibility in production
    >
      <button onClick={onClose} className="modal-close-button" aria-label="Close Modal">
        &times;
      </button>

      <h2 className="modal-titles">Create New Album</h2>
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label htmlFor="album-title">Album Title:</label>
          <input
            id="album-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter album title"
            aria-required="true"
          />
        </div>
        <div className="form-group">
          <label htmlFor="album-description">Description:</label>
          <textarea
            id="album-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter album description"
            aria-label="Album Description"
          />
        </div>
        <div className="form-group">
          <label htmlFor="album-category">Category:</label>
          <select
            id="album-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
            aria-required="true"
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
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
          <input {...getInputProps()} aria-label="Photo Upload" />
          {isDragActive ? (
            <p>Drop photos here...</p>
          ) : (
            <p>Drag &amp; drop photos here, or click to select files</p>
          )}
          {files.length > 0 && <p>{files.length} file(s) selected</p>}
        </div>

        {/* Thumbnails Preview */}
        {files.length > 0 && (
          <div className="thumbnails">
            {files.map((file, index) => (
              <div key={index} className="thumbnail">
                <img src={file.preview} alt={file.name} />
                <button
                  type="button"
                  onClick={() => handleRemoveFile(file)}
                  className="remove-button"
                  aria-label={`Remove ${file.name}`}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="modal-actions">
          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Album'}
          </button>
          <button type="button" onClick={onClose} className="secondary-button">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

CreateAlbumModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAlbumCreated: PropTypes.func.isRequired,
  photographerUsername: PropTypes.string.isRequired, // Pass the photographer's username
};