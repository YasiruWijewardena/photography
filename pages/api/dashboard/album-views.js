// // pages/api/dashboard/album-views.js

// import { getSession } from 'next-auth/react';
// import prisma from '../../../lib/prisma'; // Connected to 'photography' db
// import analyticsPrisma from '../../../lib/analyticsPrisma'; // Connected to 'photography_analytics' db
// import { Prisma } from '@prisma/client';

// export default async function handler(req, res) {
//   if (req.method !== 'GET') {
//     return res.status(405).json({ message: 'Method Not Allowed' });
//   }

//   const session = await getSession({ req });

//   if (!session || session.user.role !== 'photographer') {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   const { viewsType = 'total', dateRange = 7 } = req.query;

//   // Validate inputs
//   const validViewsTypes = ['total', 'unique'];
//   const validDateRanges = [7, 30, 90];

//   if (!validViewsTypes.includes(viewsType)) {
//     return res.status(400).json({ message: 'Invalid viewsType' });
//   }

//   const parsedDateRange = parseInt(dateRange, 10);
//   if (!validDateRanges.includes(parsedDateRange)) {
//     return res.status(400).json({ message: 'Invalid dateRange' });
//   }

//   try {
//     const photographer = await prisma.photographer.findUnique({
//       where: { photo_id: session.user.id }, // Ensure this matches your Prisma schema
//       select: { photo_id: true },
//     });

//     if (!photographer) {
//       return res.status(404).json({ message: 'Photographer not found' });
//     }

//     const photographerId = photographer.photo_id;

//     // Determine the date threshold
//     const dateThreshold = new Date();
//     dateThreshold.setHours(0, 0, 0, 0); // Start of the day
//     dateThreshold.setDate(dateThreshold.getDate() - parsedDateRange + 1); // Include today

//     let query;

//     if (viewsType === 'total') {
//       // Total Views: Count all AlbumViewEvent grouped by the date part of createdAt
//       query = await analyticsPrisma.$queryRaw(Prisma.sql`
//         SELECT
//           DATE(createdAt) AS theDate,
//           COUNT(*) AS total
//         FROM AlbumViewEvent
//         WHERE albumId IN (${Prisma.join(await getAlbumIds(photographerId))})
//           AND createdAt >= ${dateThreshold}
//         GROUP BY DATE(createdAt)
//         ORDER BY theDate ASC
//       `);
//     } else {
//       // Unique Views: Count distinct combinations of userId and anonymousId grouped by the date part of createdAt
//       query = await analyticsPrisma.$queryRaw(Prisma.sql`
//         SELECT
//           DATE(createdAt) AS theDate,
//           COUNT(DISTINCT COALESCE(userId, anonymousId)) AS total
//         FROM AlbumViewEvent
//         WHERE albumId IN (${Prisma.join(await getAlbumIds(photographerId))})
//           AND createdAt >= ${dateThreshold}
//         GROUP BY DATE(createdAt)
//         ORDER BY theDate ASC
//       `);
//     }

//     // Prepare the data for the chart
//     const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

//     const dateMap = {};

//     query.forEach(row => {
//       const dateObj = new Date(row.theDate);
//       const key = dateObj.toDateString();
//       dateMap[key] = Number(row.total) || 0;
//     });

//     const labels = [];
//     const values = [];
//     for (let i = parsedDateRange - 1; i >= 0; i--) {
//       const d = new Date();
//       d.setDate(d.getDate() - i);
//       d.setHours(0, 0, 0, 0); // Ensure consistent time
//       const key = d.toDateString();
//       const label = dayNames[d.getDay()];
//       labels.push(label);
//       values.push(dateMap[key] || 0);
//     }

//     res.status(200).json({ labels, values });
//   } catch (error) {
//     console.error('Error fetching album views:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// }

// // Helper function to get all album IDs for a photographer
// async function getAlbumIds(photographerId) {
//   const albums = await prisma.album.findMany({
//     where: { photographer_id: photographerId }, // Ensure this matches your Prisma schema
//     select: { id: true },
//   });
//   return albums.map(album => album.id);
// }

// pages/api/dashboard/album-views.js

import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma'; // Connected to 'photography' db
import analyticsPrisma from '../../../lib/analyticsPrisma'; // Connected to 'photography_analytics' db
import { Prisma } from '@prisma/client';

export default async function handler(req, res) {
  // Allow only GET requests
  if (req.method !== 'GET') {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Authenticate the user session
  const session = await getSession({ req });

  // Check if the user is authenticated and has the 'photographer' role
  if (!session || session.user.role !== 'photographer') {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Destructure query parameters with default values
  const { viewsType = 'total', dateRange = 7 } = req.query;

  // Validate 'viewsType' and 'dateRange' inputs
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
    // Fetch the photographer's ID from the 'photography' database
    const photographer = await prisma.photographer.findUnique({
      where: { photo_id: session.user.id }, // Ensure this matches your Prisma schema
      select: { photo_id: true },
    });

    if (!photographer) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(404).json({ message: 'Photographer not found' });
    }

    const photographerId = photographer.photo_id;

    // Fetch all album IDs associated with the photographer
    const albums = await prisma.album.findMany({
      where: { photographer_id: photographerId },
      select: { id: true },
    });

    const albumIds = albums.map((album) => album.id);

    // If no albums are found, return empty labels and values
    if (albumIds.length === 0) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json({ labels: [], values: [] });
    }

    // Determine the date threshold based on the 'dateRange'
    const dateThreshold = new Date();
    dateThreshold.setHours(0, 0, 0, 0); // Start of the day
    dateThreshold.setDate(dateThreshold.getDate() - parsedDateRange + 1); // Include today

    // Format the date threshold to match MySQL DATETIME format
    function formatDateToMySQL(date) {
      const pad = (n) => (n < 10 ? '0' + n : n);
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
        date.getHours()
      )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    const formattedDateThreshold = formatDateToMySQL(dateThreshold);

    // Execute the query based on 'viewsType'
    let queryResult;
    if (viewsType === 'total') {
      // Total Views: Count all AlbumViewEvent grouped by the date part of createdAt
      queryResult = await analyticsPrisma.$queryRaw(Prisma.sql`
        SELECT
          DATE(createdAt) AS theDate,
          COUNT(*) AS total
        FROM AlbumViewEvent
        WHERE albumId IN (${Prisma.join(albumIds)})
          AND createdAt >= ${formattedDateThreshold}
        GROUP BY DATE(createdAt)
        ORDER BY theDate ASC
      `);
    } else {
      // Unique Views: Count distinct combinations of userId and anonymousId grouped by the date part of createdAt
      queryResult = await analyticsPrisma.$queryRaw(Prisma.sql`
        SELECT
          DATE(createdAt) AS theDate,
          COUNT(DISTINCT COALESCE(userId, anonymousId)) AS total
        FROM AlbumViewEvent
        WHERE albumId IN (${Prisma.join(albumIds)})
          AND createdAt >= ${formattedDateThreshold}
        GROUP BY DATE(createdAt)
        ORDER BY theDate ASC
      `);
    }

    // Prepare the data for the chart
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const dateMap = {};

    queryResult.forEach((row) => {
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

    // Prevent caching of dynamic data
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    // Return the prepared data
    res.status(200).json({ labels, values });
  } catch (error) {
    console.error('Error fetching album views:', error);
    res.setHeader('Cache-Control', 'no-store');
    res.status(500).json({ message: 'Internal Server Error' });
  }
}