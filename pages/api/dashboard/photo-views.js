// pages/api/dashboard/photo-views.js

import { getSession } from 'next-auth/react';
import analyticsPrisma from '../../../lib/analyticsPrisma'; // Ensure correct import
import prisma from '../../../lib/prisma';
import { Prisma } from '@prisma/client';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getSession({ req });

  if (!session || session.user.role !== 'photographer') {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { viewsType = 'total', dateRange = 7 } = req.query;

  // Validate inputs
  const validViewsTypes = ['total', 'unique'];
  const validDateRanges = [7, 30, 90];

  if (!validViewsTypes.includes(viewsType)) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(400).json({ message: 'Invalid viewsType' });
  }

  const parsedDateRange = parseInt(dateRange, 10);
  if (!validDateRanges.includes(parsedDateRange)) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(400).json({ message: 'Invalid dateRange' });
  }

  try {
    

    // Fetch photographer's ID from 'photography' database
    const photographer = await prisma.photographer.findUnique({
      where: { photo_id: session.user.id }, // Ensure this matches your Prisma schema
      select: { photo_id: true },
    });

    if (!photographer) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(404).json({ message: 'Photographer not found' });
    }

    const photographerId = photographer.photo_id;

    // Determine the date threshold in UTC
    const dateThreshold = new Date();
    dateThreshold.setUTCHours(0, 0, 0, 0); // Start of the day in UTC
    dateThreshold.setUTCDate(dateThreshold.getUTCDate() - parsedDateRange + 1); // Include today

    // Format the date threshold
    function formatDateToMySQL(date) {
      const pad = (n) => (n < 10 ? '0' + n : n);
      return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
    }

    const formattedDateThreshold = formatDateToMySQL(dateThreshold);

    // Fetch photograph IDs from 'photography' database
    const photographs = await prisma.photograph.findMany({
      where: { photographer_id: photographerId },
      select: { id: true },
    });
    const photographIds = photographs.map((photo) => photo.id);

    // Check if photographIds array is not empty
    if (photographIds.length === 0) {
      
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json({ labels: [], values: [] });
    }

    // Execute the query based on viewsType
    let queryResult;
    if (viewsType === 'total') {
      // Total Views
      queryResult = await analyticsPrisma.$queryRaw(
        Prisma.sql`
          SELECT
            DATE(createdAt) AS theDate,
            COUNT(*) AS total
          FROM PhotoViewEvent
          WHERE photoId IN (${Prisma.join(photographIds)})
            AND createdAt >= ${formattedDateThreshold}
          GROUP BY DATE(createdAt)
          ORDER BY theDate ASC
        `
      );
    } else {
      // Unique Views
      queryResult = await analyticsPrisma.$queryRaw( Prisma.sql `
        SELECT
          DATE(createdAt) AS theDate,
          COUNT(DISTINCT COALESCE(userId, anonymousId)) AS total
        FROM PhotoViewEvent
        WHERE photoId IN (${Prisma.join(photographIds)})
          AND createdAt >= ${formattedDateThreshold}
        GROUP BY DATE(createdAt)
        ORDER BY theDate ASC
      `);
    }


    // Prepare the data for the chart
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const dateMap = {};

    queryResult.forEach((row) => {
      // Corrected date parsing
      const dateObj = new Date(row.theDate);
      const key = dateObj.toDateString();
      dateMap[key] = Number(row.total) || 0;
    });

    const labels = [];
    const values = [];
    for (let i = parsedDateRange - 1; i >= 0; i--) {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - i);
      d.setUTCHours(0, 0, 0, 0); // Ensure consistent time
      const key = d.toDateString();
      const label = dayNames[d.getUTCDay()];
      labels.push(label);
      values.push(dateMap[key] || 0);
    }


    // Prevent caching
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    res.status(200).json({ labels, values });
  } catch (error) {
    console.error('Error fetching photo views:', error);
    res.setHeader('Cache-Control', 'no-store');
    res.status(500).json({ message: 'Internal Server Error' });
  }
}