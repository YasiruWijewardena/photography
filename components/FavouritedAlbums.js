// components/FavouritedAlbums.js

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import PropTypes from 'prop-types';

export default function FavouritedAlbums({ username }) {
  const { data: session } = useSession();
  const [favouritedAlbums, setFavouritedAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch favourited albums
    const fetchFavourites = async () => {
      try {
        const res = await fetch(`/api/customer/${username}/favourites`);
        if (res.ok) {
          const data = await res.json();
          setFavouritedAlbums(data.favourites);
        } else {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch favourites');
        }
      } catch (error) {
        console.error('Error fetching favourites:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (session && session.user.username === username) {
      fetchFavourites();
    } else {
      setLoading(false);
    }
  }, [session, username]);

  if (loading) {
    return <p>Loading your favourited albums...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!favouritedAlbums.length) {
    return <p>You have not favourited any albums yet.</p>;
  }

  return (
    <div className="favourited-albums">
      <h2>Your Favourit Albums</h2>
      <div className="albums-grid">
        {favouritedAlbums.map((album) => (
          <div key={album.id} className="album-card">
            <Link href={`/${album.Photographer.User.username}/albums/${album.slug}`}>
              
                <div className="album-image">
                  <Image
                    src={album.photographs[0]?.thumbnail_url || '/default-thumbnail.jpg'}
                    alt={album.title}
                    width={300}
                    height={200}
                    objectFit="cover"
                  />
                </div>
                <div className="album-info">
                  <h3>{album.title}</h3>
                  <p>By: {album.Photographer.User.firstname} {album.Photographer.User.lastname}</p>
                </div>
              
            </Link>
          </div>
        ))}
      </div>
      <style jsx>{`
        .favourited-albums {
          padding: 20px;
        }

        .favourited-albums h2 {
          margin-bottom: 20px;
        }

        .albums-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .album-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          transition: box-shadow 0.3s;
        }

        .album-card:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .album-image {
          width: 100%;
          height: 200px;
          position: relative;
        }

        .album-info {
          padding: 10px;
        }

        .album-info h3 {
          margin: 0 0 10px 0;
          font-size: 20px;
        }

        .album-info p {
          margin: 0;
          color: #555;
        }

        .error-message {
          color: red;
        }
      `}</style>
    </div>
  );
}

FavouritedAlbums.propTypes = {
  username: PropTypes.string.isRequired,
};