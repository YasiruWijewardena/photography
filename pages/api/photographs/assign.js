// pages/api/photographs/assign.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'photographer') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { photoIds, targetAlbumId } = req.body;
  if (!Array.isArray(photoIds) || !targetAlbumId) {
    return res.status(400).json({ error: 'Invalid input data.' });
  }

  const photographerId = await getPhotographerId(session.user.id);

  const targetAlbum = await prisma.album.findUnique({
    where: { id: targetAlbumId }
  });
  if (!targetAlbum || targetAlbum.photographer_id !== photographerId) {
    return res.status(404).json({ error: 'Target album not found or not yours.' });
  }

  await prisma.photograph.updateMany({
    where: {
      id: { in: photoIds },
      photographer_id: photographerId,
    },
    data: {
      album_id: targetAlbumId
    }
  });

  return res.json({ message: 'Photos moved successfully' });
}

async function getPhotographerId(userId) {
  const photographer = await prisma.photographer.findUnique({ where: { photo_id: userId } });
  return photographer?.photo_id;
}
