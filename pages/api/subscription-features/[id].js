// /pages/api/subscription-features/[id].js

import prisma from '../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'admin' || session.user.admin_level !== 'SUPER') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  const { id } = req.query;
  
  if (req.method === 'PUT') {
    const { key, description, dataType } = req.body;
    try {
      const updatedFeature = await prisma.subscriptionFeature.update({
        where: { id: parseInt(id, 10) },
        data: { key, description, dataType },
      });
      return res.status(200).json(updatedFeature);
    } catch (error) {
      console.error('Error updating feature:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.subscriptionFeature.delete({
        where: { id: parseInt(id, 10) },
      });
      return res.status(200).json({ message: 'Feature deleted' });
    } catch (error) {
      console.error('Error deleting feature:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}