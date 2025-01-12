// pages/api/customer/[username]/favourites.js

import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  const { username } = req.query;

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Get the session
  const session = await getSession({ req });

  // Authorization: Ensure the session user matches the requested username and is a customer
  if (
    !session ||
    session.user.role !== 'customer' ||
    session.user.username !== username
  ) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Step 1: Find the User by username
    const user = await prisma.user.findUnique({
      where: { username: username },
      include: {
        favourites: {
          where: {
            album_id: {
              not: null,
            },
          },
          include: {
            Album: {
              include: {
                Photographer: { // Corrected field name with capital 'P'
                  select: {
                    User: {
                      select: {
                        username: true,
                        firstname: true,
                        lastname: true,
                        image: true, // Corrected field name from 'profile_image' to 'image'
                      },
                    },
                  },
                },
                photographs: {
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 2: Extract the favourited albums
    const favouritedAlbums = user.favourites.map((fav) => fav.Album);

    res.status(200).json({ favourites: favouritedAlbums });
  } catch (error) {
    console.error('Error fetching favourites:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}