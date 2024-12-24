// pages/api/photos/delete.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'photographer') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { photoId } = req.body;
  const photographerId = await getPhotographerId(session.user.id);
  if (!photographerId) return res.status(404).json({ error: 'Photographer profile not found' });

  const photo = await prisma.photograph.findUnique({ where: { id: photoId } });
  if (!photo || photo.photographer_id !== photographerId) {
    return res.status(404).json({ error: 'Photo not found or no permission' });
  }

  await prisma.photograph.delete({ where: { id: photoId } });
  return res.json({ message: 'Photo deleted successfully' });
}

async function getPhotographerId(userId) {
  const photographer = await prisma.photographer.findUnique({ where: { photo_id: userId } });
  return photographer?.photo_id;
}
