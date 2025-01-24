// pages/api/dashboard/top-viewed-albums.js

import { getSession } from 'next-auth/react';
import analyticsDb from '../../../lib/analyticsPrisma';
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

    // Fetch all album IDs and details for the photographer
    const albums = await prisma.album.findMany({
      where: { photographer_id: photographerId },
      select: { id: true, title: true, slug: true, Category: { select: { name: true } } },
    });

    if (albums.length === 0) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json({ topAlbums: [] });
    }

    const albumIds = albums.map(album => album.id);

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
          ev.albumId,
          COUNT(*) AS viewCount
        FROM AlbumViewEvent ev
        WHERE ev.albumId IN (${Prisma.join(albumIds)})
        ${dateFilter}
        GROUP BY ev.albumId
        HAVING viewCount > 0
        ORDER BY viewCount DESC
        LIMIT 5
      `;
    } else if (viewsType === 'unique') {
      // Unique Views
      viewCountQuery = Prisma.sql`
        SELECT
          ev.albumId,
          COUNT(DISTINCT COALESCE(ev.userId, ev.anonymousId)) AS viewCount
        FROM AlbumViewEvent ev
        WHERE ev.albumId IN (${Prisma.join(albumIds)})
        ${dateFilter}
        GROUP BY ev.albumId
        HAVING viewCount > 0
        ORDER BY viewCount DESC
        LIMIT 5
      `;
    }

    // Execute the view count query
    const topViews = await analyticsDb.$queryRaw(viewCountQuery);

    if (topViews.length === 0) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json({ topAlbums: [] });
    }

    // Map albumId to viewCount, converting BigInt to Number
    const albumViewMap = {};
    topViews.forEach(view => {
      albumViewMap[view.albumId] = Number(view.viewCount); // Convert BigInt to Number
    });

    // Combine album details with view counts
    const topAlbumsData = albums
      .filter(album => albumViewMap[album.id])
      .map(album => ({
        id: album.id,
        title: album.title,
        slug: album.slug,
        category: album.Category.name,
        viewCount: albumViewMap[album.id], // Now a Number
      }))
      .sort((a, b) => b.viewCount - a.viewCount) // Ensure sorting
      .slice(0, 5); // Limit to top 5

    // Prevent caching
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    return res.status(200).json({ topAlbums: topAlbumsData });
  } catch (error) {
    console.error('Error fetching top albums:', error);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}