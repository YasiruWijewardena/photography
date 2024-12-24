// pages/api/photographs/[id]/likeStatus.js

import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ isLiked: false, isFavourited: false });
  }

  const { id } = req.query; // Photograph ID
  const userId = session.user.id; // Assuming user ID is stored in session

  if (req.method === 'GET') {
    try {
      // Fetch Like Status
      const like = await prisma.like.findUnique({
        where: {
          user_photo_unique: {
            user_id: userId, // Updated field name
            photograph_id: parseInt(id),
          },
        },
      });

      // Fetch Favourite Status
      const favourite = await prisma.favourite.findUnique({
        where: {
          user_photo_unique: {
            user_id: userId, // Updated field name
            photograph_id: parseInt(id),
          },
        },
      });

      res.status(200).json({
        isLiked: !!like,
        isFavourited: !!favourite,
      });
    } catch (error) {
      console.error('Error fetching like status:', error);
      res.status(500).json({ isLiked: false, isFavourited: false });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
