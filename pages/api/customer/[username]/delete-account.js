// pages/api/customer/[username]/delete-account.js

import { getSession } from 'next-auth/react';
import prisma from '../../../../../../lib/prisma';

export default async function handler(req, res) {
  const { username } = req.query;

  // Only allow DELETE requests
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Get the session
  const session = await getSession({ req });

  if (!session || session.user.role !== 'customer' || session.user.username !== username) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Delete the user and cascade delete related customer data
    await prisma.user.delete({
      where: { username: username },
    });

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}