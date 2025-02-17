// pages/api/photographer/delete-profile.js

import prisma from '../../../lib/prisma'; // Adjust the path based on your project structure
import { getSession } from 'next-auth/react';
import fs from 'fs-extra';
import path from 'path';

export default async function handler(req, res) {
  // Only allow DELETE requests
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // Get user session
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }

  const userId = session.user.id; // Ensure user ID is present in session

  try {
    // Fetch user with related data
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      include: {
        Photographer: {
          include: {
            subscriptions: {
              where: { active: true },
              include: { subscriptionPlan: { select: { name: true, id: true } } },
              take: 1,
            },
          },
        },
        Customer: true,
        Admin: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Delete associated profile picture if exists
    if (user.Photographer?.profile_picture) {
      const profilePicPath = path.join(process.cwd(), 'public', user.Photographer.profile_picture);
      if (await fs.pathExists(profilePicPath)) {
        await fs.remove(profilePicPath);
      }
    }

    // Delete the user and cascade deletes related records
    await prisma.user.delete({
      where: { id: Number(userId) },
    });

    // Optionally, you can also delete associated files or perform other cleanup tasks here

    return res.status(200).json({ message: 'Profile deleted successfully.' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    return res.status(500).json({ error: 'Error deleting profile.' });
  }
}