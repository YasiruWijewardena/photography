// pages/api/users/[username]/albums/[slug]/photos.js

import { getSession } from 'next-auth/react';
import prisma from '../../../../../../lib/prisma';

export default async function handler(req, res) {
  const session = await getSession({ req });
  const { username, slug } = req.query;
  const { cursor, limit = 20 } = req.query;
  const userId = session?.user?.id || null;

  try {
    // Retrieve the user along with Photographer relation
    const user = await prisma.user.findUnique({
      where: { username: username },
      include: {
        Photographer: true, // Include Photographer relation
      },
    });

    if (!user || !user.Photographer) {
      return res.status(404).json({ message: 'Photographer not found' });
    }

    const photographerId = user.Photographer.photo_id; // Correctly reference Photographer.photo_id

    // Retrieve the album by slug and photographer_id
    const album = await prisma.album.findUnique({
      where: {
        slug_photographer_id: {
          slug: slug,
          photographer_id: photographerId,
        },
      },
      include: {
        Category: {
          select: { name: true },
        },
      },
    });

    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    const albumId = album.id;

    if (req.method !== 'GET') {
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    // Query the database for album photos
    const photos = await prisma.photograph.findMany({
      where: { album_id: albumId },
      take: parseInt(limit) + 1, // Fetch one extra to determine if there are more
      skip: cursor ? 1 : 0, // Skip the cursor if it exists
      cursor: cursor ? { id: parseInt(cursor) } : undefined,
      orderBy: { id: 'asc' },
      include: {
        Album: {
          include: {
            Category: {
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
          where: { user_id: userId ?? -1 }, // Use -1 as a fallback
          select: { id: true },
        },
        favourites: {
          where: { user_id: userId ?? -1 }, // Use -1 as a fallback
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