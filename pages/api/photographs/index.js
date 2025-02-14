// pages/api/photographs/index.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'photographer') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  console.log(session);

  const photographerId = await getPhotographerId(session.user.id);

  if (req.method === 'DELETE') {
    const { photoIds } = req.body;
    if (!Array.isArray(photoIds) || photoIds.length === 0) {
      return res.status(400).json({ error: 'No photo IDs provided.' });
    }

    const photos = await prisma.photograph.findMany({
      where: {
        id: { in: photoIds },
        photographer_id: photographerId
      }
    });

    for (const photo of photos) {
      const actualPath = path.join(process.cwd(), 'public', photo.image_url);
      await safeUnlink(actualPath);
    }

    for (const photo of photos) {
      if (photo.thumbnail_url && photo.thumbnail_url !== photo.image_url) {
        const actualPath = path.join(process.cwd(), 'public', photo.thumbnail_url);
        await safeUnlink(actualPath);
      }
      
    }


    

    await prisma.photograph.deleteMany({
      where: {
        id: { in: photoIds },
        photographer_id: photographerId
      }
    });

    return res.json({ message: 'Photos deleted' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function getPhotographerId(userId) {
  const photographer = await prisma.photographer.findUnique({ where: { photo_id: userId } });
  return photographer?.photo_id;
}

async function safeUnlink(filePath) {
  try {
    await fs.unlink(filePath);
  } catch (err) {}
}
