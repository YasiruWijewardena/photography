// pages/api/admin/photographers/[id]/approve.js

import { withAdminAuth } from '../../../../../middleware/adminMiddleware';
import prisma from '../../../../../lib/prisma';

async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'POST') {
    try {
      const photographer = await prisma.photographer.findUnique({
        where: { photo_id: parseInt(id) },
      });

      if (!photographer) {
        return res.status(404).json({ error: 'Photographer not found' });
      }

      await prisma.photographer.update({
        where: { photo_id: parseInt(id) },
        data: { is_approved: true },
      });

      res.status(200).json({ message: 'Photographer approved' });
    } catch (error) {
      console.error('Error approving photographer:', error);
      res.status(500).json({ error: 'Error approving photographer' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default withAdminAuth('BASIC', handler);
