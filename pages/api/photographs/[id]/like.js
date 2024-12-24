// pages/api/photographs/[id]/like.js

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import prisma from '../../../../lib/prisma'; // Adjust the import path based on your project structure

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query; // Photograph ID
  const userId = session.user.id; // Ensure this matches your session structure

  if (req.method === 'POST') {
    // Like the photo
    try {
      // Check if the like already exists using the named unique constraint
      const existingLike = await prisma.like.findUnique({
        where: {
          user_photo_unique: {
            user_id: userId,
            photograph_id: parseInt(id),
          },
        },
      });

      if (existingLike) {
        return res.status(400).json({ message: 'Photo already liked' });
      }

      await prisma.like.create({
        data: {
          user_id: userId,
          photograph_id: parseInt(id),
        },
      });

      // Optionally, increment the like count
      await prisma.photograph.update({
        where: { id: parseInt(id) },
        data: { likes_count: { increment: 1 } },
      });

      res.status(200).json({ message: 'Photo liked' });
    } catch (error) {
      console.error('Error liking photo:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    // Unlike the photo
    try {
      const deletedLike = await prisma.like.delete({
        where: {
          user_photo_unique: {
            user_id: userId,
            photograph_id: parseInt(id),
          },
        },
      });

      // Optionally, decrement the like count
      await prisma.photograph.update({
        where: { id: parseInt(id) },
        data: { likes_count: { decrement: 1 } },
      });

      res.status(200).json({ message: 'Photo unliked' });
    } catch (error) {
      console.error('Error unliking photo:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
