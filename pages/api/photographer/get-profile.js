// pages/api/photographer/get-profile.js

import prisma from '../../../lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }
  const userId = session.user.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        username: true,
        email: true,
        Photographer: {
          select: {
            bio: true,
            website: true,
            instagram: true,
            mobile_num: true,
            profile_picture: true,
            subscriptions: {
              where: { active: true },
              include: { subscriptionPlan: { select: { id: true, name: true } } },
              take: 1,
            },
          },
        },
      },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ error: 'Error fetching profile.' });
  }
}