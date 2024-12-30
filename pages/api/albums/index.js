// pages/api/albums/index.js

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]'; // Adjust path as necessary
import prisma from '../../../lib/prisma';
import { generateUniqueSlug } from '../../../lib/slugify';
import PropTypes from 'prop-types';

export default async function handler(req, res) {
  // Authenticate the user
  const session = await getServerSession(req, res, authOptions);

  // Debugging log to verify session details
  console.log('Session in /api/albums:', session);

  // Authorization: Only allow photographers
  if (!session || session.user.role !== 'photographer') {
    console.log('Unauthorized access attempt:', {
      session,
      requiredRole: 'photographer',
    });
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Initialize photographerId
  let photographerId;

  try {
    // Fetch the Photographer record associated with the current user
    const photographer = await prisma.photographer.findUnique({
      where: { photo_id: session.user.id }, // Correctly using photo_id to reference User.id
    });

    // Debugging log to verify photographer retrieval
    console.log('Photographer fetched:', photographer);

    if (!photographer) {
      console.log('Photographer not found for user id:', session.user.id);
      return res.status(403).json({ error: 'Photographer profile not found.' });
    }

    // Assign photographerId using photo_id from Photographer
    photographerId = photographer.photo_id;
    console.log('Photographer ID:', photographerId);
  } catch (error) {
    console.error('Error fetching photographer:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }

  // Handle GET and POST requests
  if (req.method === 'GET') {
    const { excludeId } = req.query; // Fetch excludeId from query parameters

    // Build the 'where' clause for Prisma query
    const where = {
      photographer_id: photographerId, // Ensure albums belong to the authenticated photographer
    };

    if (excludeId) {
      const excludeAlbumId = Number(excludeId);
      if (isNaN(excludeAlbumId)) {
        console.log('Invalid excludeId format:', excludeId);
        return res.status(400).json({ error: 'Invalid excludeId format' });
      }
      where.id = { not: excludeAlbumId }; // Exclude the specified album
      console.log('Excluding album ID:', excludeAlbumId);
    }

    try {
      // Fetch albums based on the 'where' clause
      const albums = await prisma.album.findMany({
        where,
        orderBy: { created_at: 'desc' },
        include: { Category: true }, // Include related Category data
      });

      // Debugging log to verify fetched albums
      console.log('Fetched albums:', albums);

      return res.status(200).json({ albums });
    } catch (error) {
      console.error('Error fetching albums:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    const { title, description, category_id } = req.body;
    const category_id_int = Number(category_id);

    // Input Validation
    if (!title) {
      console.log('Title is required for album creation.');
      return res.status(400).json({ error: 'Title is required' });
    }
    if (isNaN(category_id_int)) {
      console.log('Invalid category ID format:', category_id);
      return res.status(400).json({ error: 'Invalid category ID format' });
    }

    // Validate the existence of the category
    const category = await prisma.category.findUnique({ where: { id: category_id_int } });
    if (!category) {
      console.log('Invalid category:', category_id_int);
      return res.status(400).json({ error: 'Invalid category' });
    }

    try {
      // Generate a unique slug for the album
      const slug = await generateUniqueSlug(title, photographerId);

      // Create the new album with the generated slug
      const album = await prisma.album.create({
        data: {
          title,
          description: description || '',
          photographer_id: photographerId,
          category_id: category_id_int,
          slug, // Assign the generated slug
        },
        include: {
          Category: true,
          photographs: true, // Include related photographs if needed
          // Include other relations as necessary
        },
      });

      // Debugging log to confirm album creation
      console.log('Album created successfully:', album);

      return res.status(200).json({ album });
    } catch (error) {
      console.error('Error creating album:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    // Method Not Allowed
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// PropTypes validation for handler function
handler.propTypes = {
  req: PropTypes.object.isRequired,
  res: PropTypes.object.isRequired,
};