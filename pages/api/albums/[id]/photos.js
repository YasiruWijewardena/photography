// pages/api/albums/[id]/photos.js

import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  const session = await getSession({ req });
  const { id } = req.query;
  console.log('Album ID:', id);
  const { cursor, limit = 20 } = req.query;

  try {
    console.log('Request received');
  } catch (err) {
    console.error('Error before console log:', err);
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    // Convert to numbers
    const albumIdNum = parseInt(id, 10);

    // If you want like/favourite info for the logged-in user:
    const userId = session?.user?.id || null;

    // Query the database for album photos
    // (Assuming we have a field album_id in the photograph table)
    const photos = await prisma.photograph.findMany({
        where: { album_id: albumIdNum },
        take: parseInt(limit) + 1, // Fetch one extra to determine if there are more
        skip: cursor ? 1 : 0, // Skip the cursor if it exists
        cursor: cursor ? { id: parseInt(cursor) } : undefined,
        orderBy: { id: 'asc' },
        include: {
          Album: { 
          include: {
            Category: { // Ensure "Category" is correctly capitalized
              select: { name: true },
            },
          },
        },
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
        likes: {
          where: { user_id: userId ? parseInt(userId) : -1 }, // Use -1 as a fallback
          select: { id: true },
        },
        favourites: {
          where: { user_id: userId ? parseInt(userId) : -1 }, // Use -1 as a fallback
          select: { id: true },
        },
        },
      });

      let nextCursor = null;
      if (photos.length > limit) {
        const nextItem = photos.pop();
        nextCursor = nextItem.id;
      }
  

    const formattedPhotos = photos.map(photo => ({
        id: photo.id,
        image_url: photo.image_url,
        thumbnail_url: photo.thumbnail_url,
        title: photo.title,
        description: photo.description,
        cameraModel: photo.cameraModel,
        lens: photo.lens,
        exposure: photo.exposure,
        focalLength: photo.focalLength,
        likes_count: photo.likes_count,
        album_category: photo.Album.Category.name, // Include category from Album
        photographer: {
          id: photo.Photographer.photo_id,
          name: `${photo.Photographer.User.firstname} ${photo.Photographer.User.lastname}`,
          profile_picture: photo.Photographer.profile_picture, // Accessed from Photographer
        },
        isLiked: userId ? !!photo.likes.length : false, // Set to false if not logged in
        isFavourited: userId ? !!photo.favourites.length : false, // Set to false if not logged in
      }));

      res.status(200).json({
        photos: formattedPhotos,
        nextCursor,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}