// pages/api/photographer/[username]/albums/[slug]/favourite.js

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../auth/[...nextauth]'; 
import prisma from '../../../../../../lib/prisma';

export default async function handler(req, res) {
  // Retrieve the session using getServerSession
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    console.log('No session found. Unauthorized.');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { username, slug } = req.query; // Extract username and slug
  const userId = session.user.id; // Ensure user ID is present in session

  console.log(`Received ${req.method} request for slug: '${slug}' by user ID: ${userId}`);

  // Retrieve the photographer's ID based on username from the URL
  const user = await prisma.user.findUnique({
    where: { username: username },
    include: { Photographer: { select: { photo_id: true } } },
  });

  if (!user || !user.Photographer) {
    console.log(`Photographer with username '${username}' not found.`);
    return res.status(404).json({ message: 'Photographer not found' });
  }

  const photographerId = user.Photographer.photo_id;

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
    console.log(`Album with slug '${slug}' by photographer ID '${photographerId}' not found.`);
    return res.status(404).json({ message: 'Album not found' });
  }

  const albumId = album.id; // Get the album ID from the retrieved album

  // Ownership Check: Prevent photographers from favouriting their own albums
  if (album.photographer_id === userId) {
    console.log(`User ID '${userId}' attempted to favourite their own album ID '${albumId}'.`);
    return res.status(400).json({ message: 'Cannot favourite your own album' });
  }

  if (req.method === 'POST') {
    // Add to favourites
    try {
      console.log(`Attempting to add album ID '${albumId}' to user ID '${userId}' favourites.`);

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
        console.log(`Favourite already exists for user ID '${userId}' and album ID '${albumId}'.`);
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

      console.log(`Favourite successfully added for user ID '${userId}' and album ID '${albumId}'.`);
      res.status(200).json({ message: 'Album added to favourites' });
    } catch (error) {
      console.error('Error adding favourite:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    // Remove from favourites
    try {
      console.log(`Attempting to remove album ID '${albumId}' from user ID '${userId}' favourites.`);

      const deletedFavourite = await prisma.favourite.deleteMany({
        where: {
          user_id: userId,
          album_id: albumId,
          photograph_id: null, // Ensure only album_id is considered
        },
      });

      if (deletedFavourite.count === 0) {
        console.log(`Favourite not found for user ID '${userId}' and album ID '${albumId}'.`);
        return res.status(400).json({ message: 'Favourite not found' });
      }

      console.log(`Favourite successfully removed for user ID '${userId}' and album ID '${albumId}'.`);
      res.status(200).json({ message: 'Album removed from favourites' });
    } catch (error) {
      console.error('Error removing favourite:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    console.log(`Method '${req.method}' not allowed.`);
    res.setHeader('Allow', ['POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}