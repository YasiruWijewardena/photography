// components/AddPhotosModal.js

import { useState } from 'react';
import Modal from 'react-modal';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function AddPhotosModal({ isOpen, onRequestClose, albumId, onPhotosAdded }) {
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/jpeg, image/png, image/gif',
    onDrop: (acceptedFiles) => {
      const mappedFiles = acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }));
      setFiles((prev) => [...prev, ...mappedFiles]);
    },
  });

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('No files selected');
      return;
    }

    const formData = new FormData();
    formData.append('albumId', albumId);
    files.forEach((file) => formData.append('images', file));

    try {
      await axios.post('/api/photographs/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onPhotosAdded();
      // Reset files
      setFiles([]);
      onRequestClose();
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast.error('Failed to upload photos.');
    }
  };

  const handleRemoveFile = (file) => {
    setFiles(files.filter(f => f !== file));
    URL.revokeObjectURL(file.preview);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Photos to Album"
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
      {/* Close Button */}
      <button onClick={onRequestClose} className="modal-close-button">
        &times;
      </button>

      <h2 className='modal-titles'>Add Photos</h2>
      <div
        {...getRootProps()}
        className="dropzone"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop photos here...</p>
        ) : (
          <p>Drag & drop photos here, or click to select files</p>
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
        <button onClick={handleUpload} className="primary-button">Upload</button>
      </div>
    </Modal>
  );
}
