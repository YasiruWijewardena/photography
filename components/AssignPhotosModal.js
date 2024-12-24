// components/AssignPhotosModal.js

import Modal from 'react-modal';
import Select from 'react-select';

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
      <button onClick={onRequestClose} className="modal-close-button">
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
            value={selectedTargetAlbum}
            onChange={setSelectedTargetAlbum}
            placeholder="Select an album..."
            isClearable
            className='select-album'
          />
          <div className="modal-actions">
            <button
              onClick={handleConfirmAssignment}
              disabled={!selectedTargetAlbum || assigning}
            >
              {assigning ? 'Moving...' : 'Move'}
            </button>
            
          </div>
        </>
      )}
    </Modal>
  );
}
