// pages/api/public/albums.js

import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const albums = await prisma.album.findMany({
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
          },
          take: 10,
        },
      },
      orderBy: { created_at: 'desc' },
    });

    // Map albums to ensure lowercase 'photographer'
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
      })),
      photographer: album.Photographer
        ? {
            profile_picture: album.Photographer.profile_picture,
            name: `${album.Photographer.User.firstname} ${album.Photographer.User.lastname}`,
            username: album.Photographer.User.username,
          }
        : null,
    }));

    res.status(200).json({ albums: formattedAlbums });
  } catch (error) {
    console.error('Error fetching public albums:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}