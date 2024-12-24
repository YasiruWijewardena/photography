import { withAdminAuth } from '../../../../../middleware/adminMiddleware';
import prisma from '../../../../../lib/prisma';
import { getSession } from 'next-auth/react';

async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    const session = await getSession({ req });

    if (
      !session ||
      session.user.role !== 'admin' ||
      session.user.admin_level !== 'SUPER'
    ) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    try {
      if (parseInt(id) === session.user.admin_id) {
        return res.status(400).json({ error: 'You cannot delete yourself.' });
      }

      await prisma.admin.delete({
        where: { admin_id: parseInt(id) },
      });

      await prisma.user.delete({
        where: { id: parseInt(id) },
      });

      res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
      console.error('Error deleting admin:', error);
      res.status(500).json({ error: 'Error deleting admin' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default withAdminAuth('SUPER', handler);
