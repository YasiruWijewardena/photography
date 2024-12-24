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
      !['BASIC', 'SUPER'].includes(session.user.admin_level)
    ) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    try {
      // Delete the photographer
      await prisma.photographer.delete({
        where: { photo_id: parseInt(id) },
      });

      res.status(200).json({ message: 'Photographer deleted successfully' });
    } catch (error) {
      console.error('Error deleting photographer:', error);
      res.status(500).json({ error: 'Error deleting photographer' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default withAdminAuth('BASIC', handler);
