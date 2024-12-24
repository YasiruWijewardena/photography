// pages/api/admin/photographers.js

import { withAdminAuth } from '../../../middleware/adminMiddleware';
import prisma from '../../../lib/prisma';

async function handler(req, res) {
  const photographers = await prisma.photographer.findMany({
    include: {
      User: true,
    },
  });
  res.json(photographers);
}

export default withAdminAuth('BASIC', handler);
