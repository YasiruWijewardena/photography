// pages/[username].js

import { useRouter } from 'next/router';
import { useSession, getSession } from 'next-auth/react';
import PhotographerLayout from '../components/PhotographerLayout';
import PublicProfile from '../components/PublicProfile';
import Dashboard from '../components/PhotographerDashboard'; // Import as a component, not a page
import prisma from '../lib/prisma';
import { useEffect } from 'react';
import analyticsDb from '../lib/analyticsPrisma';
import { getOrSetAnonymousId } from '../lib/anonymousId';

export default function PhotographerPage({ photographerData, isOwner, snapshot, chartData, albumChartData }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to login if owner is trying to access their dashboard without authentication
  useEffect(() => {
    if (isOwner && status !== 'authenticated') {
      router.push('/login');
    }
  }, [isOwner, status, router]);

  return (
    <PhotographerLayout
      isOwner={isOwner}
      photographerId={photographerData.id}
      photographerUsername={photographerData.username}
    >
      {isOwner ? (
        <Dashboard snapshot={snapshot} chartData={chartData} albumChartData={albumChartData} firstname={photographerData.firstname}/>
      ) : (
        <PublicProfile photographerData={photographerData} />
      )}
    </PhotographerLayout>
  );
}

export async function getServerSideProps(context) {
  const { username } = context.params;
  const session = await getSession(context);

  const photographerId = session.user.id; 

  // Validate the username
  if (!username || typeof username !== 'string') {
    return { notFound: true };
  }

  try {
    // Fetch the photographer based on username
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        Photographer: {
          include: {
            Subscription: true,
            albums: {
              include: {
                photographs: { take: 1, select: { thumbnail_url: true } },
              },
            },
          },
        },
      },
    });

    if (!user || !user.Photographer) {
      return { notFound: true };
    }

    const photographer = user.Photographer;

    const formattedPhotographer = {
      id: photographer.photo_id, // Photographer's unique ID
      firstname:  user.firstname,
      name: `${user.firstname} ${user.lastname}`,
      username: user.username, // Ensure username is included
      bio: photographer.bio,
      website: photographer.website,
      instagram: photographer.instagram,
      mobile_num: photographer.mobile_num,
      address: photographer.address,
      profile_picture: photographer.profile_picture,
      is_approved: photographer.is_approved,
      subscription_id: photographer.subscription_id,
      subscription_name: photographer.Subscription?.name || '',
      albums: photographer.albums.map((album) => ({
        id: album.id,
        slug: album.slug,
        title: album.title,
        description: album.description,
        cover_photo_url: album.photographs[0]?.thumbnail_url || null,
      })),
    };

    const isOwner =
      session?.user?.role === 'photographer' &&
      session.user.username === username; // Compare usernames instead of IDs

    // -- RECORD A PROFILE VIEW if the visitor is NOT the owner.
    if (!isOwner) {
      // If user is logged in, use their userId. Otherwise, use an anonymousId.
      let userId = null;
      let anonymousId = null;

      if (session?.user?.id) {
        userId = session.user.id;
      } else {
        // Not logged in, so get or create an anonymousId cookie
        anonymousId = getOrSetAnonymousId(context.req, context.res);
      }

      // Log the event in the analytics DB
      await analyticsDb.profileViewEvent.create({
        data: {
          userId: userId,
          anonymousId: anonymousId,
          profileUserId: photographer.photo_id,
        },
      });
    }

    let snapshot = null;
    let chartData = null;
    let albumChartData = null;

    if (isOwner) {
      // -----------------------------
      // 1) SNAPSHOT STATS
      // -----------------------------

      // (A) Profile Views
      const totalProfileViews = await analyticsDb.$queryRaw`
        SELECT COUNT(*) AS cnt
        FROM ProfileViewEvent
        WHERE profileUserId = ${photographerId}
      `;
      const profileViewsCount = Number(totalProfileViews[0]?.cnt) ?? 0;

      // (B) Album Views
      const totalAlbumViews = await analyticsDb.$queryRaw`
        SELECT COUNT(*) AS cnt
        FROM AlbumViewEvent ev
        JOIN photography.albums a ON a.id = ev.albumId
        WHERE a.photographer_id = ${photographerId}
      `;
      const albumViewsCount = Number(totalAlbumViews[0]?.cnt) ?? 0;

      // (C) Photo Views
      const totalPhotoViews = await analyticsDb.$queryRaw`
        SELECT COUNT(*) AS cnt
        FROM PhotoViewEvent ev
        JOIN photography.photographs p ON p.id = ev.photoId
        WHERE p.photographer_id = ${photographerId}
      `;
      const photoViewsCount = Number(totalPhotoViews[0]?.cnt) ?? 0;

      // (D) Total Likes
      const totalLikes = await prisma.$queryRaw`
        SELECT COUNT(*) AS cnt
        FROM likes l
        JOIN photographs p ON p.id = l.photograph_id
        WHERE p.photographer_id = ${photographerId}
      `;
      const likesCount = Number(totalLikes[0]?.cnt) ?? 0;

      // (E) Total Favourites
      const totalFavourites = await prisma.$queryRaw`
        SELECT (
          (SELECT COUNT(*) 
           FROM favourites f
           JOIN photographs p2 ON p2.id = f.photograph_id
           WHERE p2.photographer_id = ${photographerId}
          )
          +
          (SELECT COUNT(*)
           FROM favourites f
           JOIN albums a2 ON a2.id = f.album_id
           WHERE a2.photographer_id = ${photographerId}
          )
        ) AS cnt
      `;
      const favouritesCount = Number(totalFavourites[0]?.cnt) ?? 0;

      snapshot = {
        totalProfileViews: profileViewsCount,
        totalAlbumViews: albumViewsCount,
        totalPhotoViews: photoViewsCount,
        totalLikes: likesCount,
        totalFavourites: favouritesCount,
      };

      // -----------------------------
      // 2) TIME-SERIES DATA for Chart
      // -----------------------------
      const last7Days = await analyticsDb.$queryRaw`
        SELECT
          DATE(ev.createdAt) AS theDate,
          COUNT(*) AS total
        FROM PhotoViewEvent ev
        JOIN photography.photographs p ON p.id = ev.photoId
        WHERE p.photographer_id = ${photographerId}
          AND ev.createdAt >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        GROUP BY DATE(ev.createdAt)
        ORDER BY theDate ASC
      `;

      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      const dateMap = {};
      last7Days.forEach((row) => {
        const dateObj = new Date(row.theDate);
        dateMap[dateObj.toDateString()] = Number(row.total) || 0;
      });

      const chartLabels = [];
      const chartValues = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i); // i days in the past
        const key = d.toDateString(); // e.g. "Tue Jan 17 2025"
        const label = dayNames[d.getDay()]; // short day-of-week
        chartLabels.push(label);
        chartValues.push(dateMap[key] || 0);
      }

      chartData = {
        labels: chartLabels,   // e.g. ["Wed","Thu","Fri","Sat","Sun","Mon","Tue"]
        values: chartValues,   // e.g. [5, 0, 2, 10, 3, 8, 4]
      };

       // -----------------------------
      // 3) TIME-SERIES DATA for Album Views Chart
      // -----------------------------
      const last7DaysAlbumViews = await analyticsDb.$queryRaw`
        SELECT
          DATE(ev.createdAt) AS theDate,
          COUNT(*) AS total
        FROM AlbumViewEvent ev
        JOIN photography.albums a ON a.id = ev.albumId
        WHERE a.photographer_id = ${photographerId}
          AND ev.createdAt >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        GROUP BY DATE(ev.createdAt)
        ORDER BY theDate ASC
      `;

      const dateMapAlbum = {};
      last7DaysAlbumViews.forEach((row) => {
        const dateObj = new Date(row.theDate);
        dateMapAlbum[dateObj.toDateString()] = Number(row.total) || 0;
      });

      const chartLabelsAlbum = [];
      const chartValuesAlbum = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i); // i days in the past
        const key = d.toDateString(); // e.g. "Tue Jan 17 2025"
        const label = dayNames[d.getDay()]; // short day-of-week
        chartLabelsAlbum.push(label);
        chartValuesAlbum.push(dateMapAlbum[key] || 0);
      }

      albumChartData = {
        labels: chartLabelsAlbum,   // e.g. ["Wed","Thu","Fri","Sat","Sun","Mon","Tue"]
        values: chartValuesAlbum,   // e.g. [5, 0, 2, 10, 3, 8, 4]
      };


    }

    

    return {
      props: {
        photographerData: formattedPhotographer,
        isOwner,
        snapshot,
        chartData,
        albumChartData,
      },
    };
  } catch (error) {
    console.error('Error fetching photographer profile:', error);
    return { notFound: true };
  }
}