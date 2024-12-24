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
import { authOptions } from '../auth/[...nextauth]'; // Adjust the path as necessary
import prisma from '../../../lib/prisma'; // Adjust the path as necessary

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || session.user.role !== 'photographer') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const photographerId = await getPhotographerId(session.user.id);
  const { id } = req.query;
  const albumId = parseInt(id, 10);

  if (isNaN(albumId)) {
    return res.status(400).json({ error: 'Invalid album ID' });
  }

  const album = await prisma.album.findUnique({
    where: { id: albumId },
    include: { 
      photographs: true,
      Photographer: true,
      Category: true,
      tags: true,
      likes: true,
      favourites: true 
    },
  });

  if (!album || album.photographer_id !== photographerId) {
    return res.status(404).json({ error: 'Album not found or no permission' });
  }

  if (req.method === 'GET') {
    // Serialize the album data, converting Date objects to strings
    const serializedAlbum = {
      ...album,
      created_at: album.created_at.toISOString(),
      updated_at: album.updated_at.toISOString(),
      photographs: album.photographs.map(photo => ({
        ...photo,
        created_at: photo.created_at.toISOString(),
        updated_at: photo.updated_at.toISOString(),
      })),
    };
    return res.status(200).json({ album: serializedAlbum });
  } else if (req.method === 'PUT') {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    try {
      const updated = await prisma.album.update({
        where: { id: albumId },
        data: { title, description },
      });
      // Serialize updated data
      const serializedUpdated = {
        ...updated,
        created_at: updated.created_at.toISOString(),
        updated_at: updated.updated_at.toISOString(),
      };
      return res.status(200).json({ album: serializedUpdated });
    } catch (error) {
      console.error('Error updating album:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      // Handle deletion logic here
      await prisma.photograph.deleteMany({ where: { album_id: albumId } });
      await prisma.album.delete({ where: { id: albumId } });
      return res.status(200).json({ message: 'Album deleted' });
    } catch (error) {
      console.error('Error deleting album:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

async function getPhotographerId(userId) {
  const photographer = await prisma.photographer.findUnique({ where: { photo_id: userId } });
  return photographer?.photo_id;
}


