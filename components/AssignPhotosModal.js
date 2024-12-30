// components/AssignPhotosModal.js

import Modal from 'react-modal';
import Select from 'react-select';
import PropTypes from 'prop-types';

export default function AssignPhotosModal({
  isOpen,
  onRequestClose,
  availableAlbums,
  selectedTargetAlbum,
  setSelectedTargetAlbum,
  loadingAvailableAlbums,
  handleConfirmAssignment,
  assigning,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Assign Photos to Another Album"
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
      <button onClick={onRequestClose} className="modal-close-button" aria-label="Close Assign Photos Modal">
        &times;
      </button>

      <h2 className='modal-titles'> Move Photos to Another Album</h2>
      {loadingAvailableAlbums ? (
        <p>Loading available albums...</p>
      ) : availableAlbums.length === 0 ? (
        <p>No other albums available.</p>
      ) : (
        <>
          <Select
            options={availableAlbums.map((a) => ({
              value: a.id,
              label: a.title,
            }))}
            value={selectedTargetAlbum ? { value: selectedTargetAlbum.id, label: selectedTargetAlbum.title } : null}
            onChange={(selectedOption) => {
              if (selectedOption) {
                const album = availableAlbums.find(a => a.id === selectedOption.value);
                setSelectedTargetAlbum(album);
              } else {
                setSelectedTargetAlbum(null);
              }
            }}
            placeholder="Select an album..."
            isClearable
            className='select-album'
            aria-label="Select target album for photo assignment"
          />
          <div className="modal-actions">
            <button
              onClick={handleConfirmAssignment}
              disabled={!selectedTargetAlbum || assigning}
              className="primary-button"
            >
              {assigning ? 'Moving...' : 'Move'}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}

AssignPhotosModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  availableAlbums: PropTypes.array.isRequired,
  selectedTargetAlbum: PropTypes.object, // Can be null
  setSelectedTargetAlbum: PropTypes.func.isRequired,
  loadingAvailableAlbums: PropTypes.bool.isRequired,
  handleConfirmAssignment: PropTypes.func.isRequired,
  assigning: PropTypes.bool.isRequired,
};