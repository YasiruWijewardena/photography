// pages/api/random-photos.js

import { getSession } from 'next-auth/react';
import prisma from '../../lib/prisma'; // Adjust the path as necessary

export default async function handler(req, res) {
  const { cursor, limit = 20, categories } = req.query;
  const session = await getSession({ req });
  const userId = session?.user?.id || null;

  // Parse categories if provided
  const categoryList = categories ? categories.split(',').map(cat => cat.trim()) : [];

  try {
    const photos = await prisma.photograph.findMany({
      where: {
        // Corrected relation field name to "Album" with capital "A"
        Album: categoryList.length > 0 ? {
          Category: { // Ensure "Category" is correctly capitalized
            name: { in: categoryList },
          },
        } : undefined,
      },
      take: parseInt(limit) + 1, // Fetch one extra to determine if there are more
      skip: cursor ? 1 : 0, // Skip the cursor if it exists
      cursor: cursor ? { id: parseInt(cursor) } : undefined,
      orderBy: { id: 'asc' }, // Consistent ordering by 'id'
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

    // Map the photos to include necessary fields and like/favourite status
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
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
