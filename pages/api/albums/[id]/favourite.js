// pages/api/albums/[id]/favourite.js

import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query; // Album ID
  const userId = session.user.id; // Assuming user ID is stored in session

  if (req.method === 'POST') {
    // Add to favourites
    try {
      // Check if the favourite already exists
      const existingFavourite = await prisma.favourite.findUnique({
        where: {
          user_album_unique: {
            user_id: userId, // Updated field name
            album_id: parseInt(id),
          },
        },
      });

      if (existingFavourite) {
        return res.status(400).json({ message: 'Album already in favourites' });
      }

      // Create a new favourite
      await prisma.favourite.create({
        data: {
          user_id: userId, // Updated field name
          album_id: parseInt(id),
          photograph_id: null, // Ensure only album_id is set
        },
      });

      res.status(200).json({ message: 'Album added to favourites' });
    } catch (error) {
      console.error('Error adding favourite:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    // Remove from favourites
    try {
      const deletedFavourite = await prisma.favourite.deleteMany({
        where: {
          user_id: userId, // Updated field name
          album_id: parseInt(id),
          photograph_id: null, // Ensure only album_id is considered
        },
      });

      if (deletedFavourite.count === 0) {
        return res.status(400).json({ message: 'Favourite not found' });
      }

      res.status(200).json({ message: 'Album removed from favourites' });
    } catch (error) {
      console.error('Error removing favourite:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
