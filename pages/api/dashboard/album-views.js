// pages/api/dashboard/album-views.js

import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma'; // Connected to 'photography' db
import analyticsPrisma from '../../../lib/analyticsPrisma'; // Connected to 'photography_analytics' db
import { Prisma } from '@prisma/client';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getSession({ req });

  if (!session || session.user.role !== 'photographer') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { viewsType = 'total', dateRange = 7 } = req.query;

  // Validate inputs
  const validViewsTypes = ['total', 'unique'];
  const validDateRanges = [7, 30, 90];

  if (!validViewsTypes.includes(viewsType)) {
    return res.status(400).json({ message: 'Invalid viewsType' });
  }

  const parsedDateRange = parseInt(dateRange, 10);
  if (!validDateRanges.includes(parsedDateRange)) {
    return res.status(400).json({ message: 'Invalid dateRange' });
  }

  try {
    const photographer = await prisma.photographer.findUnique({
      where: { photo_id: session.user.id }, // Ensure this matches your Prisma schema
      select: { photo_id: true },
    });

    if (!photographer) {
      return res.status(404).json({ message: 'Photographer not found' });
    }

    const photographerId = photographer.photo_id;

    // Determine the date threshold
    const dateThreshold = new Date();
    dateThreshold.setHours(0, 0, 0, 0); // Start of the day
    dateThreshold.setDate(dateThreshold.getDate() - parsedDateRange + 1); // Include today

    let query;

    if (viewsType === 'total') {
      // Total Views: Count all AlbumViewEvent grouped by the date part of createdAt
      query = await analyticsPrisma.$queryRaw(Prisma.sql`
        SELECT
          DATE(createdAt) AS theDate,
          COUNT(*) AS total
        FROM AlbumViewEvent
        WHERE albumId IN (${Prisma.join(await getAlbumIds(photographerId))})
          AND createdAt >= ${dateThreshold}
        GROUP BY DATE(createdAt)
        ORDER BY theDate ASC
      `);
    } else {
      // Unique Views: Count distinct combinations of userId and anonymousId grouped by the date part of createdAt
      query = await analyticsPrisma.$queryRaw(Prisma.sql`
        SELECT
          DATE(createdAt) AS theDate,
          COUNT(DISTINCT COALESCE(userId, anonymousId)) AS total
        FROM AlbumViewEvent
        WHERE albumId IN (${Prisma.join(await getAlbumIds(photographerId))})
          AND createdAt >= ${dateThreshold}
        GROUP BY DATE(createdAt)
        ORDER BY theDate ASC
      `);
    }

    // Debugging: Log the query results
    console.log('Album Views Query Result:', query);

    // Prepare the data for the chart
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const dateMap = {};

    query.forEach(row => {
      const dateObj = new Date(row.theDate);
      const key = dateObj.toDateString();
      dateMap[key] = Number(row.total) || 0;
    });

    const labels = [];
    const values = [];
    for (let i = parsedDateRange - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0); // Ensure consistent time
      const key = d.toDateString();
      const label = dayNames[d.getDay()];
      labels.push(label);
      values.push(dateMap[key] || 0);
    }

    res.status(200).json({ labels, values });
  } catch (error) {
    console.error('Error fetching album views:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

// Helper function to get all album IDs for a photographer
async function getAlbumIds(photographerId) {
  const albums = await prisma.album.findMany({
    where: { photographer_id: photographerId }, // Ensure this matches your Prisma schema
    select: { id: true },
  });
  console.log('Album IDs:', albums.map(album => album.id)); // Debugging
  return albums.map(album => album.id);
}