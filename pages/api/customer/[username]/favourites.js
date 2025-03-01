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

  // **Prevent Caching**
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

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
    // Read query params:
    const { search = '', limit, cursor } = req.query;

    // Convert limit to a number
    const take = parseInt(limit, 10) || 10;

    // Build a 'where' clause for searching by album title
    const whereClause = {};
    if (search) {
      whereClause.title = {
        contains: search,
      };
    }

    // **Ensure Consistent Sorting and Cursor**
    const findManyArgs = {
      where: {
        ...whereClause,
        favourites: {
          some: {
            user_id: session.user.id,
          },
        },
      },
      orderBy: { id: 'desc' }, // Sort by 'id' in descending order
      take: take, // Fetch exactly 'limit' albums
      include: {
        Photographer: {
          select: {
            profile_picture: true,
            User: {
              select: {
                firstname: true,
                lastname: true,
                username: true,
              },
            },
          },
        },
        photographs: {
          select: {
            id: true,
            thumbnail_url: true,
            image_url: true,
            title: true,
            Photographer: {
              select: {
                profile_picture: true,
                User: {
                  select: {
                    firstname: true,
                    lastname: true,
                    username: true,
                  },
                },
              },
            },
            _count: {
              select: { likes: true },
            },
            likes: session.user.id
              ? {
                  where: { user_id: session.user.id },
                  select: { id: true },
                }
              : false,
            favourites: session.user.id
              ? {
                  where: { user_id: session.user.id },
                  select: { id: true },
                }
              : false,
          },
        },
        favourites: session.user.id
          ? {
              where: { user_id: session.user.id },
              select: { id: true },
            }
          : false,
      },
    };

    // If a cursor is provided, use it for pagination
    if (cursor) {
      const cursorId = parseInt(cursor, 10);
      if (isNaN(cursorId)) {
        return res.status(400).json({ error: 'Invalid cursor' });
      }
      findManyArgs.cursor = { id: cursorId };
      findManyArgs.skip = 1; // Skip the cursor album
    }

    const albums = await prisma.album.findMany(findManyArgs);

    console.log(`Fetched ${albums.length} favourited albums with cursor=${cursor}`);

    // Determine if there's a next page
    const hasMore = albums.length === take;
    const nextCursor = hasMore ? albums[albums.length - 1].id : null;

    // Format the albums
    const formattedAlbums = albums.map((album) => ({
      ...album,
      photographs: album.photographs.map((photo) => ({
        ...photo,
        photographer: photo.Photographer
          ? {
              profile_picture: photo.Photographer.profile_picture,
              name: `${photo.Photographer.User.firstname} ${photo.Photographer.User.lastname}`,
              username: photo.Photographer.User.username,
            }
          : null,
        likes_count: photo._count.likes,
        isLiked: session.user.id ? !!photo.likes?.length : false,
        isFavourited: session.user.id ? !!photo.favourites?.length : false,
      })),
      photographer: album.Photographer
        ? {
            profile_picture: album.Photographer.profile_picture,
            name: `${album.Photographer.User.firstname} ${album.Photographer.User.lastname}`,
            username: album.Photographer.User.username,
          }
        : null,
      isFavourited: session.user.id ? !!album.favourites?.length : false,
    }));

    console.log(`Returning ${formattedAlbums.length} favourited albums, nextCursor=${nextCursor}`);

    res.status(200).json({
      favourites: formattedAlbums,
      nextCursor: nextCursor || null, // null if no more
    });
  } catch (error) {
    console.error('Error fetching favourited albums:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}