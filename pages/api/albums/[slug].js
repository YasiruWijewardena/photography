// pages/api/albums/[slug].js

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';
import { generateUniqueSlug } from '../../../lib/slugify';
import PropTypes from 'prop-types';
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  const { slug } = req.query; // Changed from id to slug
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'photographer') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const photographerId = Number(session.user.photographer_id);

  if (!photographerId) {
    return res.status(403).json({ error: 'Photographer ID not found in session.' });
  }

  // Fetch the album to ensure it belongs to the current photographer
  const album = await prisma.album.findUnique({
    where: { 
      slug_photographer_id: {
        slug: slug,
        photographer_id: photographerId,
      },
    },
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

      const MAX_DESCRIPTION_LENGTH = 255;
      if (description && description.length > MAX_DESCRIPTION_LENGTH) {
        return res.status(400).json({
          error: `Description is too long. Maximum ${MAX_DESCRIPTION_LENGTH} characters allowed.`,
        });
      }

      try {
        // Generate a new unique slug if the title has changed
        let newSlug = slug;
        if (title !== album.title) {
          newSlug = await generateUniqueSlug(title, photographerId);
        }

        const updatedAlbum = await prisma.album.update({
          where: { slug_photographer_id: { slug, photographer_id: photographerId } },
          data: { title, description, slug: newSlug },
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
          // Remove thumbnails if applicable
          const thumbPath = path.join(process.cwd(), 'public', photo.thumbnail_url);
          await safeUnlink(thumbPath);
        }
    
        // Remove all photographs from DB
        await prisma.photograph.deleteMany({ where: { album_id: album.id } });
    
        // Delete chapters associated with this album
        await prisma.chapter.deleteMany({ where: { albumId: album.id } });
    
        // Finally, delete the album
        await prisma.album.delete({ 
          where: { slug_photographer_id: { slug, photographer_id: photographerId } } 
        });
    
        return res.status(200).json({ message: 'Album deleted successfully' });
      } catch (err) {
        console.error('Error deleting album:', err);
        return res.status(500).json({ error: 'Failed to delete album.' });
      }
    }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

async function safeUnlink(filePath) {
  try {
    await fs.unlink(filePath);
  } catch (err) {
    // Ignore if file doesn't exist
  }
}

handler.propTypes = {
  req: PropTypes.object.isRequired,
  res: PropTypes.object.isRequired,
};