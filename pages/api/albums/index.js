// pages/api/albums/index.js

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]'; // Adjust path as necessary
import prisma from '../../../lib/prisma';
import { generateUniqueSlug } from '../../../lib/slugify';
import PropTypes from 'prop-types';

export default async function handler(req, res) {
  // Authenticate the user
  const session = await getServerSession(req, res, authOptions);
  console.log('Session in /api/albums:', session);
  if (!session || session.user.role !== 'photographer') {
    console.log('Unauthorized access attempt:', { session, requiredRole: 'photographer' });
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Get the photographer's ID from the Photographer table using session.user.id
  let photographerId;
  try {
    const photographer = await prisma.photographer.findUnique({
      where: { photo_id: session.user.id },
    });
    console.log('Photographer fetched:', photographer);
    if (!photographer) {
      console.log('Photographer not found for user id:', session.user.id);
      return res.status(403).json({ error: 'Photographer profile not found.' });
    }
    photographerId = photographer.photo_id;
    console.log('Photographer ID:', photographerId);
  } catch (error) {
    console.error('Error fetching photographer:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }

  if (req.method === 'GET') {
    const { excludeId } = req.query;
    const where = { photographer_id: photographerId };
    if (excludeId) {
      const excludeAlbumId = Number(excludeId);
      if (isNaN(excludeAlbumId)) {
        console.log('Invalid excludeId format:', excludeId);
        return res.status(400).json({ error: 'Invalid excludeId format' });
      }
      where.id = { not: excludeAlbumId };
      console.log('Excluding album ID:', excludeAlbumId);
    }

    try {
      const albums = await prisma.album.findMany({
        where,
        orderBy: { created_at: 'desc' },
        include: { Category: true, chapters: true },
      });
      console.log('Fetched albums:', albums);
      return res.status(200).json({ albums });
    } catch (error) {
      console.error('Error fetching albums:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    // Expecting title, description, category_id and optionally chapters from req.body
    const { title, description, category_id, chapters } = req.body;
    const category_id_int = Number(category_id);

    if (!title) {
      console.log('Title is required for album creation.');
      return res.status(400).json({ error: 'Title is required' });
    }
    if (isNaN(category_id_int)) {
      console.log('Invalid category ID format:', category_id);
      return res.status(400).json({ error: 'Invalid category ID format' });
    }

    // Validate category existence
    const category = await prisma.category.findUnique({ where: { id: category_id_int } });
    if (!category) {
      console.log('Invalid category:', category_id_int);
      return res.status(400).json({ error: 'Invalid category' });
    }

    try {
      // Generate a unique slug for the album
      const slug = await generateUniqueSlug(title, photographerId);

      // Create the new album and, if provided, create nested chapters
      const album = await prisma.album.create({
        data: {
          title,
          description: description || '',
          photographer_id: photographerId,
          category_id: category_id_int,
          slug,
          // Create chapters if provided
          chapters: chapters && chapters.length > 0 ? { create: chapters } : undefined,
        },
        include: {
          Category: true,
          photographs: true,
          chapters: true,
        },
      });

      console.log('Album created successfully:', album);
      return res.status(200).json({ album });
    } catch (error) {
      console.error('Error creating album:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

handler.propTypes = {
  req: PropTypes.object.isRequired,
  res: PropTypes.object.isRequired,
};