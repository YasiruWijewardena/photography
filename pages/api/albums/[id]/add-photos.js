// pages/api/albums/[id]/add-photos.js

import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query; // Album ID

  if (req.method === 'POST') {
    try {
      const { photoIds } = req.body; // Array of photograph IDs
      const updatedPhotos = await prisma.photograph.updateMany({
        where: {
          id: { in: photoIds },
          photographer_id: req.user.id,
        },
        data: {
          album_id: parseInt(id),
        },
      });
      res.status(200).json(updatedPhotos);
    } catch (error) {
      res.status(500).json({ error: 'Failed to assign photographs to album' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
