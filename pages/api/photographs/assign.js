// pages/api/photographs/assign.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  // Authenticate the user
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'photographer') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Allow only POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { photoIds, targetAlbumId } = req.body;

  // Validate input data
  if (!Array.isArray(photoIds) || photoIds.length === 0 || !targetAlbumId) {
    return res.status(400).json({ error: 'Invalid input data. Ensure photoIds is a non-empty array and targetAlbumId is provided.' });
  }

  try {
    // Fetch the photographer's profile based on the session
    const photographer = await prisma.photographer.findUnique({
      where: { photo_id: session.user.id }, // Correct field name
    });

    if (!photographer) {
      return res.status(404).json({ error: 'Photographer profile not found.' });
    }

    const photographerId = photographer.photo_id; // Use photographer's primary key

    // Verify that the target album exists and belongs to the photographer
    const targetAlbum = await prisma.album.findUnique({
      where: { id: targetAlbumId },
    });

    if (!targetAlbum) {
      return res.status(404).json({ error: 'Target album not found.' });
    }

    if (targetAlbum.photographer_id !== photographerId) {
      return res.status(403).json({ error: 'You do not have permission to assign photos to this album.' });
    }

    // Update the album_id of the selected photographs
    const updateResult = await prisma.photograph.updateMany({
      where: {
        id: { in: photoIds },
        photographer_id: photographerId,
      },
      data: {
        album_id: targetAlbumId,
      },
    });

    if (updateResult.count === 0) {
      return res.status(404).json({ error: 'No photos were updated. Check if the photoIds are correct and belong to your albums.' });
    }

    return res.status(200).json({ message: 'Photos moved successfully.', updatedCount: updateResult.count });
  } catch (error) {
    console.error('Error assigning photos:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}