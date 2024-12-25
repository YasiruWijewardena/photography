// pages/api/albums/[id].js

// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '../auth/[...nextauth]';
// import prisma from '../../../lib/prisma';
// import { promises as fs } from 'fs';
// import path from 'path';

// export default async function handler(req, res) {
//   // Use getServerSession instead of getSession
//   const session = await getServerSession(req, res, authOptions);
  
//   // Debugging: Log the session
//   console.log('Session:', session);

//   if (!session || session.user.role !== 'photographer') {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   const photographerId = await getPhotographerId(session.user.id);

//   const { id } = req.query;
//   const albumId = parseInt(id, 10);

//   const album = await prisma.album.findUnique({
//     where: { id: albumId },
//     include: { 
//       photographs: true,
//       Photographer: true,
//       Category: true,
//       tags: true,
//       likes: true,
//       favourites: true 
//     },
//   });
  

//   if (!album || album.photographer_id !== photographerId) {
//     return res.status(404).json({ error: 'Album not found or no permission' });
//   }

//   if (req.method === 'GET') {
//     return res.json({ album });
//   } else if (req.method === 'PUT') {
//     const { title, description } = req.body;
//     const updated = await prisma.album.update({
//       where: { id: albumId },
//       data: { title, description },
//     });
//     return res.json({ album: updated });
//   } else if (req.method === 'DELETE') {
//     for (const photo of album.photographs) {
//       const actualPath = path.join(process.cwd(), 'public', photo.image_url);
//       await safeUnlink(actualPath);
//     }

//     await prisma.photograph.deleteMany({ where: { album_id: albumId } });
//     await prisma.album.delete({ where: { id: albumId } });
//     return res.json({ message: 'Album deleted' });
//   }

//   return res.status(405).json({ error: 'Method not allowed' });
// }

// async function getPhotographerId(userId) {
//   const photographer = await prisma.photographer.findUnique({ where: { photo_id: userId } });
//   return photographer?.photo_id; // Ensure this matches your Prisma schema
// }

// async function safeUnlink(filePath) {
//   try {
//     await fs.unlink(filePath);
//   } catch (err) {
//     console.error(`Failed to delete file at ${filePath}:`, err);
//   }
// }

// pages/api/albums/[id].js

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

  const photographerId = await getPhotographerId(session.user.id);
  if (!photographerId) {
    return res.status(403).json({ error: 'Photographer not found or no permission.' });
  }

  const albumIdNum = parseInt(req.query.id, 10);
  if (isNaN(albumIdNum)) {
    return res.status(400).json({ error: 'Invalid album ID' });
  }

  // Fetch the album to ensure it belongs to the current photographer
  const album = await prisma.album.findUnique({
    where: { id: albumIdNum },
    include: {
      photographs: true,
    },
  });
  if (!album) {
    return res.status(404).json({ error: 'Album not found.' });
  }
  if (album.photographer_id !== photographerId) {
    return res.status(403).json({ error: 'You do not own this album.' });
  }

  switch (req.method) {
    case 'GET':
      // Return the album data
      return res.json({ album });

    case 'PUT': {
      const { title, description } = req.body;
      if (!title) {
        return res.status(400).json({ error: 'Title is required for update.' });
      }
      try {
        const updatedAlbum = await prisma.album.update({
          where: { id: albumIdNum },
          data: { title, description },
        });
        return res.status(200).json({ album: updatedAlbum });
      } catch (error) {
        console.error('Error updating album:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }

    case 'DELETE': {
      try {
        // Delete all associated photos from the filesystem
        for (const photo of album.photographs) {
          const actualPath = path.join(process.cwd(), 'public', photo.image_url);
          await safeUnlink(actualPath);
          // Could also remove thumbnails if needed
          const thumbPath = path.join(process.cwd(), 'public', photo.thumbnail_url);
          await safeUnlink(thumbPath);
        }

        // Then remove from DB
        await prisma.photograph.deleteMany({ where: { album_id: albumIdNum } });
        await prisma.album.delete({ where: { id: albumIdNum } });

        return res.status(200).json({ message: 'Album deleted successfully' });
      } catch (err) {
        console.error('Error deleting album:', err);
        return res.status(500).json({ error: 'Failed to delete album.' });
      }
    }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}

async function getPhotographerId(userId) {
  const photographer = await prisma.photographer.findUnique({ where: { photo_id: userId } });
  return photographer?.photo_id;
}

async function safeUnlink(filePath) {
  try {
    await fs.unlink(filePath);
  } catch (err) {
    // ignore if file doesn't exist
  }
}



