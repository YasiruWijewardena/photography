// pages/api/dashboard/top-viewed-photos.js

import { getSession } from 'next-auth/react';
import analyticsDb from '../../../lib/analyticsPrisma'; // Analytics database Prisma client
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
    const { viewsType = 'total', dateRange = '7' } = req.query;

    // Validate viewsType
    const validViewsTypes = ['total', 'unique'];
    if (!validViewsTypes.includes(viewsType)) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(400).json({ error: 'Invalid viewsType parameter' });
    }

    // Validate dateRange
    const validDateRanges = ['7', '30', '90', 'all'];
    if (!validDateRanges.includes(dateRange)) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(400).json({ error: 'Invalid dateRange parameter' });
    }

    // Fetch all photo IDs and details for the photographer, including the album's slug and category
    const photos = await prisma.photograph.findMany({
      where: { photographer_id: photographerId },
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
      },
    });

    if (photos.length === 0) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json({ topPhotos: [] });
    }

    const photoIds = photos.map(photo => photo.id);

    // Determine the date filter
    let dateFilter = Prisma.empty; // Initialize as empty
    if (dateRange !== 'all') {
      const days = parseInt(dateRange, 10);
      dateFilter = Prisma.sql`AND ev.createdAt >= DATE_SUB(CURDATE(), INTERVAL ${days - 1} DAY)`;
    }

    // Construct the SQL query based on viewsType
    let viewCountQuery;
    if (viewsType === 'total') {
      // Total Views
      viewCountQuery = Prisma.sql`
        SELECT
          ev.photoId,
          COUNT(*) AS viewCount
        FROM PhotoViewEvent ev
        WHERE ev.photoId IN (${Prisma.join(photoIds)})
        ${dateFilter}
        GROUP BY ev.photoId
        HAVING viewCount > 0
        ORDER BY viewCount DESC
        LIMIT 5
      `;
    } else if (viewsType === 'unique') {
      // Unique Views
      viewCountQuery = Prisma.sql`
        SELECT
          ev.photoId,
          COUNT(DISTINCT COALESCE(ev.userId, ev.anonymousId)) AS viewCount
        FROM PhotoViewEvent ev
        WHERE ev.photoId IN (${Prisma.join(photoIds)})
        ${dateFilter}
        GROUP BY ev.photoId
        HAVING viewCount > 0
        ORDER BY viewCount DESC
        LIMIT 5
      `;
    }

    // Execute the view count query
    const topViews = await analyticsDb.$queryRaw(viewCountQuery);

    if (topViews.length === 0) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json({ topPhotos: [] });
    }

    // Map photoId to viewCount, converting BigInt to Number
    const photoViewMap = {};
    topViews.forEach(view => {
      photoViewMap[view.photoId] = Number(view.viewCount); // Convert BigInt to Number
    });

    // Combine photo details with view counts and category
    const topPhotosData = photos
      .filter(photo => photoViewMap[photo.id])
      .map(photo => ({
        id: photo.id,
        title: photo.title, // Include title for alt text
        thumbnailUrl: photo.thumbnail_url,
        albumSlug: photo.Album.slug, // Access 'Album' relation
        category: photo.Album.Category.name, // Include category name
        viewCount: photoViewMap[photo.id], // Now a Number
      }))
      .sort((a, b) => b.viewCount - a.viewCount) // Ensure sorting
      .slice(0, 10); // Limit to top 10

    // Prevent caching
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    return res.status(200).json({ topPhotos: topPhotosData });
  } catch (error) {
    console.error('Error fetching top photos:', error);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}