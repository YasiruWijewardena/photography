// pages/api/photographer/[id]/profile.js

import prisma from '../../../../lib/prisma'; // Adjust the path as necessary
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const { id } = req.query; // Capture the [id] from the dynamic route

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // Validate the ID
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'Invalid photographer ID.' });
  }

  try {
    const photographer = await prisma.photographer.findUnique({
      where: { photo_id: Number(id) }, // Use photo_id as per your schema
      include: {
        User: {
          select: {
            firstname: true,
            lastname: true,
            // Removed profile_picture as it's in the Photographer model
          },
        },
        albums: {
          include: {
            photographs: {
              take: 1, // Fetch one photo as cover
              select: {
                thumbnail_url: true,
              },
            },
          },
        },
      },
    });

    if (!photographer) {
      return res.status(404).json({ error: 'Photographer not found.' });
    }

    // Format the data
    const formattedPhotographer = {
      id: photographer.photo_id, // Use photo_id as the unique identifier
      name: `${photographer.User.firstname} ${photographer.User.lastname}`,
      bio: photographer.bio,
      website: photographer.website,
      instagram: photographer.instagram,
      mobile_num: photographer.mobile_num,
      profile_picture: photographer.profile_picture, // Correctly fetched from Photographer
      albums: photographer.albums.map((album) => ({
        id: album.id,
        title: album.title,
        description: album.description,
        cover_photo_url: album.photographs[0]?.thumbnail_url || null, // Use the first photo as cover
      })),
    };

    res.status(200).json({ photographer: formattedPhotographer });
  } catch (error) {
    console.error('Error fetching photographer profile:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
