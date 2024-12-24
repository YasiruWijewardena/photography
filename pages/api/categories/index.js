// pages/api/categories/index.js

import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
      });
      res.status(200).json({ categories });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
