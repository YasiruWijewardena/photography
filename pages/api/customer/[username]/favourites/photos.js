// pages/api/customer/[username]/favourites/photos.js

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]';
import prisma from '../../../../../lib/prisma';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const { username } = req.query;

  // Check if the user is authenticated
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Check if the session user matches the requested username
  if (session.user.username !== username) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Handle GET requests
  if (req.method === 'GET') {
    try {
      // Fetch all favourites with related Photograph and Photographer data
      const favourites = await prisma.favourite.findMany({
        where: {
          user_id: session.user.id,
          photograph_id: { not: null },
        },
        include: {
          Photograph: {
            include: {
              Photographer: {
                include: {
                  User: {
                    select: {
                      firstname: true,
                      lastname: true,
                      email: true,
                    },
                  },
                },
              },
              Album: {
                include: {
                  Category: {
                    select: { name: true },
                  },
                },
              },
              likes: {
                where: { user_id: session.user.id },
                select: { id: true },
              },
              favourites: {
                where: { user_id: session.user.id },
                select: { id: true },
              },
            },
          },
        },
        orderBy: {
          created_at: 'desc', // Adjust ordering as needed
        },
      });

      // Format the photos to match the frontend expectations
      const formattedPhotos = favourites.map((fav) => ({
        id: fav.Photograph.id,
        image_url: fav.Photograph.image_url,
        thumbnail_url: fav.Photograph.thumbnail_url,
        title: fav.Photograph.title,
        description: fav.Photograph.description,
        cameraModel: fav.Photograph.cameraModel,
        lens: fav.Photograph.lens,
        exposure: fav.Photograph.exposure,
        focalLength: fav.Photograph.focalLength,
        likes_count: fav.Photograph.likes_count,
        album_category: fav.Photograph.Album?.Category?.name || 'Uncategorized',
        photographer: {
          id: fav.Photograph.Photographer.id,
          name: `${fav.Photograph.Photographer.User.firstname} ${fav.Photograph.Photographer.User.lastname}`,
          username: fav.Photograph.Photographer.User.username,
          profile_picture: fav.Photograph.Photographer.profile_picture || '/default_profile.png', // Correctly access from User
        },
        isLiked: fav.Photograph.likes.length > 0,
        isFavourited: fav.Photograph.favourites.length > 0,
      }));

      res.status(200).json({
        photos: formattedPhotos,
      });
    } catch (error) {
      console.error('Error fetching favourite photos:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    // Method Not Allowed
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}