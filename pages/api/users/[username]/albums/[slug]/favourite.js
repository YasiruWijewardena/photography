// pages/api/users/[username]/albums/[slug]/favourite.js

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../auth/[...nextauth]'; // Adjust the path as necessary
import prisma from '../../../../../../lib/prisma';

export default async function handler(req, res) {
  // Retrieve the session using getServerSession
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { username, slug } = req.query; // Extract username and slug
  const userId = session.user.id; // Ensure user ID is present in session

  // Retrieve the photographer's ID based on username
  const photographer = await prisma.user.findUnique({
    where: { username: username },
    select: { id: true },
  });

  if (!photographer) {
    return res.status(404).json({ message: 'Photographer not found' });
  }

  const photographerId = photographer.id;

  // Retrieve the album by slug and photographer_id
  const album = await prisma.album.findUnique({
    where: {
      slug_photographer_id: {
        slug: slug,
        photographer_id: photographerId,
      },
    },
  });

  if (!album) {
    return res.status(404).json({ message: 'Album not found' });
  }

  const albumId = album.id; // Get the album ID from the retrieved album

  if (req.method === 'POST') {
    // Add to favourites
    try {
      // Check if the favourite already exists
      const existingFavourite = await prisma.favourite.findUnique({
        where: {
          user_album_unique: {
            user_id: userId,
            album_id: albumId,
          },
        },
      });

      if (existingFavourite) {
        return res.status(400).json({ message: 'Album already in favourites' });
      }

      // Create a new favourite
      await prisma.favourite.create({
        data: {
          user_id: userId,
          album_id: albumId,
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
          user_id: userId,
          album_id: albumId,
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