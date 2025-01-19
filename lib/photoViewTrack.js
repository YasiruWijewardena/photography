// lib/photoViewTrack.js
export async function trackPhotoView(photoId) {
    try {
      await fetch('/api/analytics/photo-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoId }),
      });
    } catch (err) {
      console.error('Failed to track photo view:', err);
    }
  }