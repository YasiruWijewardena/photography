import { withAdminAuth } from '../../../middleware/adminMiddleware';
import prisma from '../../../lib/prisma';

async function handler(req, res) {
  const admins = await prisma.admin.findMany({
    include: {
      User: true,
    },
  });
  res.json(admins);
}

export default withAdminAuth('SUPER', handler);
