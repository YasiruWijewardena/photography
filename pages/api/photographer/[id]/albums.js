// pages/api/photographer/[id]/albums.js

import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;
  const photographerId = parseInt(id, 10);

  if (isNaN(photographerId)) {
    return res.status(400).json({ error: 'Invalid photographer ID' });
  }

  if (req.method === 'GET') {
    try {
      const albums = await prisma.album.findMany({
        where: { photographer_id: photographerId },
        orderBy: { created_at: 'desc' },
        include: { Category: true },
      });
      res.status(200).json({ albums });
    } catch (error) {
      console.error('Error fetching albums:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
