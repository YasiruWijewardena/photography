// pages/api/public/albums.js

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Fetch the session to determine if the user is authenticated
  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.id;

  try {
    const { search = '' } = req.query;
    let whereClause = {};

    if (search) {
      whereClause.title = {
        contains: search, 
      };
    }

    const albums = await prisma.album.findMany({
      where: whereClause,
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
            Photographer: { // Include Photographer info for each photograph
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
            _count: { // Include likes_count
              select: { likes: true },
            },
            likes: userId ? { // Fetch likes by the current user
              where: { user_id: userId },
              select: { id: true },
            } : false,
            favourites: userId ? { // Fetch favourites by the current user
              where: { user_id: userId },
              select: { id: true },
            } : false,
          },
          take: 10, // Adjust as needed
        },
        favourites: userId ? { // Include album's favourites by current user
          where: { user_id: userId },
          select: { id: true },
        } : false,
      },
      orderBy: { created_at: 'desc' },
    });

    // Format the albums data
    const formattedAlbums = albums.map(album => ({
      ...album,
      photographs: album.photographs.map(photo => ({
        ...photo,
        photographer: photo.Photographer
          ? {
              profile_picture: photo.Photographer.profile_picture,
              name: `${photo.Photographer.User.firstname} ${photo.Photographer.User.lastname}`,
              username: photo.Photographer.User.username,
            }
          : null, // Handle cases where Photographer is missing
        likes_count: photo._count.likes, // Include likes_count
        isLiked: userId ? !!photo.likes.length : false, // Determine if the user has liked the photo
        isFavourited: userId ? !!photo.favourites.length : false, // Determine if the user has favorited the photo
      })),
      photographer: album.Photographer
        ? {
            profile_picture: album.Photographer.profile_picture,
            name: `${album.Photographer.User.firstname} ${album.Photographer.User.lastname}`,
            username: album.Photographer.User.username,
          }
        : null,
        isFavourited: userId ? !!album.favourites.length : false,
    }));

    res.status(200).json({ albums: formattedAlbums });
  } catch (error) {
    console.error('Error fetching public albums:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}