// pages/api/dashboard/top-liked-photos.js

import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma'; // Main database Prisma client
import { Prisma } from '@prisma/client';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Authenticate the user
    const session = await getSession({ req });
    if (!session || session.user.role !== 'photographer') {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const photographerId = session.user.id; // Ensure this corresponds to Photographer.photo_id

    // Parse query parameters
    const { dateRange = 'all' } = req.query;

    // Validate dateRange
    const validDateRanges = ['7', '30', '90', 'all'];
    if (!validDateRanges.includes(dateRange)) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(400).json({ error: 'Invalid dateRange parameter' });
    }

    // Determine the date filter
    let dateFilter = {};
    if (dateRange !== 'all') {
      const days = parseInt(dateRange, 10);
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - (days - 1)); // To include today

      dateFilter = {
        created_at: {
          gte: fromDate,
        },
      };
    }

    let topPhotosData = [];

    if (dateRange === 'all') {
      // When dateRange is 'all', use the precomputed likes_count and exclude likes_count = 0
      const topLikedPhotos = await prisma.photograph.findMany({
        where: {
          photographer_id: photographerId,
          likes_count: {
            gt: 0, // Exclude photos with zero likes
          },
        },
        select: {
          id: true,
          title: true, // Include title for alt text
          thumbnail_url: true,
          Album: { // Corrected: 'Album' with uppercase A
            select: {
              slug: true,
              Category: { // Include Category relation
                select: { name: true },
              },
            },
          },
          likes_count: true, // Precomputed total likes
        },
        orderBy: {
          likes_count: 'desc',
        },
        take: 10,
      });

      topPhotosData = topLikedPhotos.map(photo => ({
        id: photo.id,
        title: photo.title,
        thumbnailUrl: photo.thumbnail_url,
        albumSlug: photo.Album.slug,
        category: photo.Album.Category.name,
        likeCount: photo.likes_count,
      }));
    } else {
      // When dateRange is not 'all', dynamically count likes within the date range
      const topLikedGrouped = await prisma.like.groupBy({
        by: ['photograph_id'],
        where: dateFilter,
        _count: {
          photograph_id: true,
        },
        orderBy: {
          _count: {
            photograph_id: 'desc',
          },
        },
        take: 10,
      });

      if (topLikedGrouped.length > 0) {
        const topLikedPhotoIds = topLikedGrouped.map(group => group.photograph_id);

        const photos = await prisma.photograph.findMany({
          where: {
            id: { in: topLikedPhotoIds },
            photographer_id: photographerId,
          },
          select: {
            id: true,
            title: true,
            thumbnail_url: true,
            Album: {
              select: {
                slug: true,
                Category: {
                  select: { name: true },
                },
              },
            },
          },
        });

        // Map photoId to likeCount
        const likeCountMap = {};
        topLikedGrouped.forEach(group => {
          likeCountMap[group.photograph_id] = group._count.photograph_id;
        });

        // Combine photo details with like counts
        topPhotosData = photos.map(photo => ({
          id: photo.id,
          title: photo.title,
          thumbnailUrl: photo.thumbnail_url,
          albumSlug: photo.Album.slug,
          category: photo.Album.Category.name,
          likeCount: likeCountMap[photo.id],
        }));

        // Sort by likeCount descending to ensure order
        topPhotosData.sort((a, b) => b.likeCount - a.likeCount);
      }
    }

    // Prevent caching
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    return res.status(200).json({ topPhotos: topPhotosData });
  } catch (error) {
    console.error('Error fetching top liked photos:', error);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}