// pages/api/albums/index.js

// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '../auth/[...nextauth]';
// import prisma from '../../../lib/prisma';

// export default async function handler(req, res) {
//   const session = await getServerSession(req, res, authOptions);
//   if (!session || session.user.role !== 'photographer') {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   const photographerId = await getPhotographerId(session.user.id);

//   if (req.method === 'GET') {
//     const excludeId = req.query.excludeId ? parseInt(req.query.excludeId, 10) : null;
//     const where = { photographer_id: photographerId };
//     if (excludeId) {
//       where.id = { not: excludeId };
//     }
//     const albums = await prisma.album.findMany({
//       where,
//       orderBy: { created_at: 'desc' },
//       include: { Category: true } // Optional: Include category data
//     });
//     return res.json({ albums });
//   } else if (req.method === 'POST') {
//     const { title, description, category_id } = req.body;

//     // Parse category_id to integer
//     const category_id_int = parseInt(category_id, 10);

//     if (!title) return res.status(400).json({ error: 'Title is required' });
//     if (isNaN(category_id_int)) {
//       return res.status(400).json({ error: 'Invalid category ID format' });
//     }

//     // Validate category_id
//     const category = await prisma.category.findUnique({ where: { id: category_id_int } });
//     if (!category) return res.status(400).json({ error: 'Invalid category' });

//     // Create the album with the parsed category_id
//     const album = await prisma.album.create({
//       data: {
//         title,
//         description: description || '',
//         photographer_id: photographerId,
//         category_id: category_id_int
//       }
//     });
//     return res.json({ album });
//   }

//   return res.status(405).json({ error: 'Method not allowed' });
// }

// async function getPhotographerId(userId) {
//   const photographer = await prisma.photographer.findUnique({ where: { photo_id: userId } });
//   return photographer?.photo_id;
// }

// pages/api/albums/index.js

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../pages/api/auth/[...nextauth].js'; // Adjust path as necessary
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // Add debugging logs
  console.log('Session in /api/albums:', session);

  // Must be a photographer
  if (!session || session.user.role !== 'photographer') {
    console.log('Unauthorized access attempt:', {
      session,
      requiredRole: 'photographer',
    });
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Get photographerId from session
  const photographerId = Number(session.user.photographer_id);

  console.log('Photographer ID from session:', photographerId);

  if (!photographerId) {
    console.log('Photographer ID not found in session.');
    return res.status(403).json({ error: 'Photographer ID not found in session.' });
  }

  if (req.method === 'GET') {
    const excludeId = req.query.excludeId ? Number(req.query.excludeId) : null;
    const where = { photographer_id: photographerId };
    if (excludeId) {
      where.id = { not: excludeId };
    }
    try {
      const albums = await prisma.album.findMany({
        where,
        orderBy: { created_at: 'desc' },
        include: { Category: true },
      });
      return res.status(200).json({ albums });
    } catch (error) {
      console.error('Error fetching albums:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    const { title, description, category_id } = req.body;
    const category_id_int = Number(category_id);

    if (!title) {
      console.log('Title is required for album creation.');
      return res.status(400).json({ error: 'Title is required' });
    }
    if (isNaN(category_id_int)) {
      console.log('Invalid category ID format:', category_id);
      return res.status(400).json({ error: 'Invalid category ID format' });
    }

    // Validate category
    const category = await prisma.category.findUnique({ where: { id: category_id_int } });
    if (!category) {
      console.log('Invalid category:', category_id_int);
      return res.status(400).json({ error: 'Invalid category' });
    }

    try {
      // Use the "photographerId" from above
      const album = await prisma.album.create({
        data: {
          title,
          description: description || '',
          photographer_id: photographerId,
          category_id: category_id_int,
        },
        include: {
          Category: true,
          photographs: true,
          // Include other relations if needed
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

