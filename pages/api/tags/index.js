// pages/api/tags/index.js

import nextConnect from 'next-connect';
import prisma from '../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

const handler = nextConnect();

// Middleware to check authentication
handler.use(async (req, res, nextMiddleware) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = session.user;
  nextMiddleware();
});

// GET: Fetch all tags
handler.get(async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' }, // Optional
    });
    res.status(200).json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

export default handler;
