// pages/api/admin/admins/[id]/approve.js

import { withAdminAuth } from '../../../../../middleware/adminMiddleware';
import prisma from '../../../../../lib/prisma';

async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'POST') {
    try {
      const admin = await prisma.admin.findUnique({
        where: { admin_id: parseInt(id) },
      });

      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }

      await prisma.admin.update({
        where: { admin_id: parseInt(id) },
        data: { is_approved: true },
      });

      res.status(200).json({ message: 'Admin approved' });
    } catch (error) {
      console.error('Error approving admin:', error);
      res.status(500).json({ error: 'Error approving admin' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default withAdminAuth('SUPER', handler);
