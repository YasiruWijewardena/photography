// components/CreateAlbumModal.js

import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';

// New component for a chapter-specific dropzone
function ChapterDropzone({ chapterIndex, onFilesDropped, photos }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (acceptedFiles) => {
      // Map files to include a preview property
      const mappedFiles = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );
      onFilesDropped(chapterIndex, mappedFiles);
    },
  });

  return (
    <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop photos here for this chapter...</p>
      ) : (
        <p>Drag & drop photos here or click to select files for this chapter</p>
      )}
      {photos && photos.length > 0 && (
        <p>{photos.length} file(s) selected for this chapter</p>
      )}
    </div>
  );
}

ChapterDropzone.propTypes = {
  chapterIndex: PropTypes.number.isRequired,
  onFilesDropped: PropTypes.func.isRequired,
  photos: PropTypes.array,
};

export default function CreateAlbumModal({ isOpen, onClose, onAlbumCreated, photographerUsername }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [descError, setDescError] = useState('');
  // Each chapter: { title, description, photos: [] }
  const [chapters, setChapters] = useState([]);
  const MAX_DESCRIPTION_LENGTH = 255;

  // Fetch categories when modal is open; reset state when closed
  useEffect(() => {
    if (isOpen) {
      axios
        .get('/api/categories')
        .then((response) => setCategories(response.data.categories))
        .catch((error) => {
          console.error('Error fetching categories:', error);
          toast.error('Failed to load categories. Please try again later.');
        });
    } else {
      setTitle('');
      setDescription('');
      setDescError('');
      setSelectedCategory('');
      setChapters([]);
    }
  }, [isOpen]);

  const handleDescriptionChange = (value) => {
    setDescription(value);
    if (value.length > MAX_DESCRIPTION_LENGTH) {
      setDescError(`Description too long! Max is ${MAX_DESCRIPTION_LENGTH} characters.`);
    } else {
      setDescError('');
    }
  };

  // Chapter state handlers
  const addChapter = () => {
    setChapters((prev) => [...prev, { title: '', description: '', photos: [] }]);
  };

  const removeChapter = (index) => {
    setChapters((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChapterChange = (index, key, value) => {
    const newChapters = [...chapters];
    newChapters[index] = { ...newChapters[index], [key]: value };
    setChapters(newChapters);
  };

  // Handler for when files are dropped into a chapter dropzone
  const handleFilesDropped = (chapterIndex, newFiles) => {
    setChapters((prevChapters) => {
      const updated = [...prevChapters];
      updated[chapterIndex].photos = [...(updated[chapterIndex].photos || []), ...newFiles];
      return updated;
    });
  };

  // Remove a photo from a chapter
  const handleRemovePhoto = (chapterIndex, file) => {
    setChapters((prevChapters) => {
      const updated = [...prevChapters];
      updated[chapterIndex].photos = updated[chapterIndex].photos.filter((f) => f !== file);
      URL.revokeObjectURL(file.preview);
      return updated;
    });
    toast.success(`Removed ${file.name}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validation Checks
    if (!title.trim()) {
      toast.error('Please provide a title for the album.');
      return;
    }
    if (!selectedCategory) {
      toast.error('Please select a category.');
      return;
    }
    if (descError) {
      toast.error('Please fix the description length before submitting.');
      return;
    }
    // Validate chapters (each chapter should have a title)
    for (let i = 0; i < chapters.length; i++) {
      if (!chapters[i].title.trim()) {
        toast.error(`Please provide a title for chapter ${i + 1}.`);
        return;
      }
    }
  
    setIsSubmitting(true);
  
    try {
      // 1) Create the album along with chapter data (without photos)
      const res = await axios.post('/api/albums', {
        title,
        description,
        category_id: parseInt(selectedCategory, 10),
        chapters: chapters.map((chapter, index) => ({
          title: chapter.title,
          description: chapter.description,
          order: index + 1,
        })),
      });
  
      const newAlbum = res.data.album;
      if (!newAlbum || !newAlbum.id || !newAlbum.slug) {
        throw new Error('Album creation response missing required fields.');
      }
  
      // Ensure the album creation response includes chapter information.
      if (!newAlbum.chapters || newAlbum.chapters.length !== chapters.length) {
        toast.error("Album creation response did not include complete chapter information.");
        setIsSubmitting(false);
        return;
      }
  
      // 2) For each chapter, upload its photos using the actual chapterId.
      for (let i = 0; i < chapters.length; i++) {
        if (chapters[i].photos && chapters[i].photos.length > 0) {
          const formData = new FormData();
          formData.append('albumId', newAlbum.id);
          // Get the chapter id from the returned album data.
          const chapterId = newAlbum.chapters[i].id;
          formData.append('chapterId', chapterId);
          chapters[i].photos.forEach((file) => formData.append('images', file));
          await axios.post('/api/photographs/add', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
      }
  
      // 3) Notify parent about the newly created album
      onAlbumCreated(newAlbum);
  
      // 4) Reset form and close modal
      setTitle('');
      setDescription('');
      setSelectedCategory('');
      setChapters([]);
      toast.success('Album created successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating album:', error);
      toast.error('Failed to create album. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Create New Album"
      style={{
        content: {
          maxHeight: '90vh',
          overflowY: 'auto',
          // You can also adjust width, padding, etc., here if needed.
        },
        overlay: {
          zIndex: 1000,
        },
      }}
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
      ariaHideApp={false}
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
            aria-required="true"
          />
        </div>
        <div className="form-group">
          <label htmlFor="album-description">Description:</label>
          <textarea
            id="album-description"
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            aria-label="Album Description"
          />
          <div className="char-counter">
            {description.length} / {MAX_DESCRIPTION_LENGTH}
          </div>
          {descError && <p className="error-message" style={{ color: 'red' }}>{descError}</p>}
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

        {/* Chapters Section */}
        <div className="chapters-section">
          <h3>Chapters</h3>
          {chapters.map((chapter, index) => (
            <div key={index} className="chapter-group">
              <label>Chapter {index + 1} Title:</label>
              <input
                type="text"
                value={chapter.title}
                onChange={(e) => handleChapterChange(index, 'title', e.target.value)}
                placeholder="Enter chapter title"
                required
              />
              <label>Description (optional):</label>
              <textarea
                value={chapter.description}
                onChange={(e) => handleChapterChange(index, 'description', e.target.value)}
                placeholder="Enter chapter description"
              />
              {/* Use the new ChapterDropzone component */}
              <ChapterDropzone
                chapterIndex={index}
                onFilesDropped={handleFilesDropped}
                photos={chapter.photos}
              />
              {/* Preview uploaded photos for this chapter */}
              {chapter.photos && chapter.photos.length > 0 && (
                <div className="thumbnails">
                  {chapter.photos.map((file, fileIndex) => (
                    <div key={fileIndex} className="thumbnail">
                      <img src={file.preview} alt={file.name} />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index, file)}
                        className="remove-button"
                        aria-label={`Remove ${file.name}`}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button type="button" onClick={() => removeChapter(index)} className="remove-chapter-button">
                Remove Chapter
              </button>
            </div>
          ))}
          <button type="button" onClick={addChapter} className="add-chapter-button">
            Add Chapter
          </button>
        </div>

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
  photographerUsername: PropTypes.string.isRequired,
};