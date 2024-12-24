// components/PhotographList.js

export default function PhotographList({ photographs }) {
    return (
      <div className="photograph-list">
        <h2>All Photographs</h2>
        {photographs.length === 0 ? (
          <p>No photographs uploaded yet.</p>
        ) : (
          <div className="photos-grid">
            {photographs.map((photo) => (
              <div key={photo.id} className="photo-card">
                <img src={photo.thumb_url} alt={photo.title} />
                <h4>{photo.title}</h4>
                <p>{photo.description}</p>
                {/* Additional actions like edit, delete can be added here */}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  