// pages/api/subscriptions/[id].js

import prisma from '../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // Only super admins can edit or delete subscriptions
  if (
    !session ||
    session.user.role !== 'admin' ||
    session.user.admin_level !== 'SUPER'
  ) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { id } = req.query;

  if (req.method === 'PUT') {
    const { name, description, price, features } = req.body;

    try {
      const subscription = await prisma.subscription.update({
        where: { id: parseInt(id, 10) },
        data: {
          name,
          description,
          price: parseFloat(price),
          features,
        },
      });
      return res.status(200).json(subscription);
    } catch (error) {
      console.error('Error updating subscription:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.subscription.delete({
        where: { id: parseInt(id, 10) },
      });
      return res.status(200).json({ message: 'Subscription deleted' });
    } catch (error) {
      console.error('Error deleting subscription:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
