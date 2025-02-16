import { getSession } from 'next-auth/react';
import PhotographerLayout from '../../../components/PhotographerLayout';
import Link from 'next/link';
import prisma from '../../../lib/prisma';
import PropTypes from 'prop-types';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';

// A simple debounce helper
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

export default function AlbumsList({
  albums,
  isOwner,
  photographerUsername,
  initialSearch,
}) {
  const router = useRouter();

  // State to store current search term
  const [searchTerm, setSearchTerm] = useState(initialSearch || '');

  // Debounced routing
  const debouncedRouteChange = useRef(
    debounce((value) => {
      // If no search term, just go to /[username]/albums
      if (!value) {
        router.push(`/${photographerUsername}/albums`);
      } else {
        router.push(`/${photographerUsername}/albums?search=${value}`);
      }
    }, 500) // half-second debounce
  ).current;

  // Whenever searchTerm changes, call the debounced router push
  useEffect(() => {
    debouncedRouteChange(searchTerm);
  }, [searchTerm, debouncedRouteChange]);

  return (
    <div className="photographer-albums">
      <h1>{isOwner ? 'My Albums' : 'Albums'}</h1>

      
      <div className='albums-filter-options'>
        {/* "Live" search input - no button */}
        <div className="album-search-bar">
          <input
            type="text"
            placeholder="Search Albums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      

      {/* Display the (already server-filtered) albums in a grid */}
      <div className="albums-grid">
        {albums.map((album) => (
          <Link
            key={album.id}
            href={`/${photographerUsername}/albums/${album.slug}`}
            className="album-card"
          >
            <Image
              src={album.cover_photo_url || '/default-album.png'}
              alt={album.title}
              width={300}
              height={200}
              className="album-cover"
            />
            <h4>{album.title}</h4>
          </Link>
        ))}
      </div>
    </div>
  );
}

AlbumsList.propTypes = {
  albums: PropTypes.array.isRequired,
  isOwner: PropTypes.bool.isRequired,
  photographerUsername: PropTypes.string.isRequired,
  initialSearch: PropTypes.string,
};

AlbumsList.defaultProps = {
  initialSearch: '',
};

/** Wrap the page in PhotographerLayout, using the album sidebar */
AlbumsList.getLayout = function getLayout(page) {
  const { albums, isOwner, photographerUsername } = page.props;
  return (
    
      <PhotographerLayout
        isOwner={isOwner}
        photographerUsername={photographerUsername}
        useAlbumSidebar={true}
        albums={albums || []}
      >
        {page}
      </PhotographerLayout>
    
  );
};

/** Server-side data fetching */
export async function getServerSideProps(context) {
  const { username } = context.params;
  const session = await getSession(context);
  // "search" param from query
  const { search = '' } = context.query;

  if (!username) {
    return { notFound: true };
  }

  // Fetch the photographer based on username
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      Photographer: {
        include: {
          subscriptions: {
            where: { active: true },
            include: { subscriptionPlan: { select: { id: true, name: true } } },
            take: 1,
          },
          albums: {
            include: {
              photographs: { take: 1, select: { thumbnail_url: true } },
              Category: true,
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

  // Determine if the user is the owner
  const isOwner =
    session?.user?.role === 'photographer' &&
    session?.user?.username === username;

  // Build a WHERE clause that filters by "title contains search"
  // This is CASE-SENSITIVE unless your MySQL collation is case-insensitive
  let whereClause = {
    photographer_id: photographer.photo_id,
  };

  // If we have "search", filter by album title
  if (search) {
    whereClause = {
      ...whereClause,
      title: {
        contains: search, // No 'mode' key => avoids error
      },
    };
  }

  // Fetch albums with your new 'whereClause'
  const albumsData = await prisma.album.findMany({
    where: whereClause,
    include: {
      Category: true,
      photographs: {
        orderBy: { created_at: 'asc' },
      },
    },
    orderBy: { created_at: 'asc' },
  });

  // Build a serialized array of albums with a cover_photo_url
  const serializedAlbums = albumsData.map((album) => ({
    ...album,
    created_at: album.created_at.toISOString(),
    updated_at: album.updated_at.toISOString(),
    cover_photo_url: album.photographs[0]?.thumbnail_url || null,
    photographs: album.photographs.map((photo) => ({
      ...photo,
      created_at: photo.created_at.toISOString(),
      updated_at: photo.updated_at.toISOString(),
    })),
  }));

  return {
    props: {
      albums: serializedAlbums,
      isOwner,
      photographerUsername: username,
      initialSearch: search,
    },
  };
}