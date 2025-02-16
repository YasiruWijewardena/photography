// /pages/api/subscription-features/index.js

import prisma from '../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'admin' || session.user.admin_level !== 'SUPER') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  if (req.method === 'GET') {
    try {
      const features = await prisma.subscriptionFeature.findMany();
      return res.status(200).json(features);
    } catch (error) {
      console.error('Error fetching features:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    const { key, description, dataType } = req.body;
    try {
      const newFeature = await prisma.subscriptionFeature.create({
        data: { key, description, dataType },
      });
      return res.status(201).json(newFeature);
    } catch (error) {
      console.error('Error creating feature:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}