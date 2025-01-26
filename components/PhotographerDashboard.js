// components/Dashboard.js

import '../styles/public/dashboard.css';
import PropTypes from 'prop-types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import Next.js Image component

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard({ snapshot, chartData, albumChartData, firstname, username }) {
  // Existing States for Photo and Album Views Charts
  const [photoViewsType, setPhotoViewsType] = useState('total');
  const [photoDateRange, setPhotoDateRange] = useState(7);
  const [photoChart, setPhotoChart] = useState(chartData);

  const [albumViewsType, setAlbumViewsType] = useState('total');
  const [albumDateRange, setAlbumDateRange] = useState(7);
  const [albumChart, setAlbumChart] = useState(albumChartData);

  // New States for Top Albums
  const [topAlbums, setTopAlbums] = useState([]);
  const [topAlbumsLoading, setTopAlbumsLoading] = useState(false);
  const [topAlbumsError, setTopAlbumsError] = useState(null);

  // States for Top Albums Filters
  const [topAlbumsViewsType, setTopAlbumsViewsType] = useState('total');
  const [topAlbumsDateRange, setTopAlbumsDateRange] = useState('7');

  // New States for Top Photos
  const [topPhotos, setTopPhotos] = useState([]);
  const [topPhotosLoading, setTopPhotosLoading] = useState(false);
  const [topPhotosError, setTopPhotosError] = useState(null);

  // States for Top Photos Filters
  const [topPhotosViewsType, setTopPhotosViewsType] = useState('total');
  const [topPhotosDateRange, setTopPhotosDateRange] = useState('7');

  // States for Top Liked Photos
  const [topLikedPhotos, setTopLikedPhotos] = useState([]);
  const [topLikedPhotosLoading, setTopLikedPhotosLoading] = useState(false);
  const [topLikedPhotosError, setTopLikedPhotosError] = useState(null);

  // States for Top Liked Photos Filters
  const [topLikedPhotosDateRange, setTopLikedPhotosDateRange] = useState('all');

  // Fetch Top Albums Data
  useEffect(() => {
    const fetchTopAlbums = async () => {
      setTopAlbumsLoading(true);
      setTopAlbumsError(null);
      try {
        const res = await fetch(`/api/dashboard/top-viewed-albums?viewsType=${topAlbumsViewsType}&dateRange=${topAlbumsDateRange}`);
        if (!res.ok) {
          throw new Error('Failed to fetch top albums data');
        }
        const data = await res.json();
        setTopAlbums(data.topAlbums);
      } catch (error) {
        console.error(error);
        setTopAlbumsError('Failed to load top albums.');
      } finally {
        setTopAlbumsLoading(false);
      }
    };

    fetchTopAlbums();
  }, [topAlbumsViewsType, topAlbumsDateRange]);

  // Fetch Top Photos Data
  useEffect(() => {
    const fetchTopPhotos = async () => {
      setTopPhotosLoading(true);
      setTopPhotosError(null);
      try {
        const res = await fetch(`/api/dashboard/top-viewed-photos?viewsType=${topPhotosViewsType}&dateRange=${topPhotosDateRange}`);
        if (!res.ok) {
          throw new Error('Failed to fetch top photos data');
        }
        const data = await res.json();
        setTopPhotos(data.topPhotos);
      } catch (error) {
        console.error(error);
        setTopPhotosError('Failed to load top photos.');
      } finally {
        setTopPhotosLoading(false);
      }
    };

    fetchTopPhotos();
  }, [topPhotosViewsType, topPhotosDateRange]);


  // Fetch Top Liked Photos Data
  useEffect(() => {
    const fetchTopLikedPhotos = async () => {
      setTopLikedPhotosLoading(true);
      setTopLikedPhotosError(null);
      try {
        const res = await fetch(`/api/dashboard/top-liked-photos?dateRange=${topLikedPhotosDateRange}`);
        if (!res.ok) {
          throw new Error('Failed to fetch top liked photos data');
        }
        const data = await res.json();
        setTopLikedPhotos(data.topPhotos);
      } catch (error) {
        console.error(error);
        setTopLikedPhotosError('Failed to load top liked photos.');
      } finally {
        setTopLikedPhotosLoading(false);
      }
    };

    fetchTopLikedPhotos();
  }, [topLikedPhotosDateRange]);

  // Existing useEffects for Photo and Album Charts
  useEffect(() => {
    const fetchPhotoData = async () => {
      try {
        const res = await fetch(`/api/dashboard/photo-views?viewsType=${photoViewsType}&dateRange=${photoDateRange}`);
        if (!res.ok) {
          throw new Error('Failed to fetch photo views data');
        }
        const data = await res.json();
        setPhotoChart(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPhotoData();
  }, [photoViewsType, photoDateRange]);

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        const res = await fetch(`/api/dashboard/album-views?viewsType=${albumViewsType}&dateRange=${albumDateRange}`);
        if (!res.ok) {
          throw new Error('Failed to fetch album views data');
        }
        const data = await res.json();
        setAlbumChart(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAlbumData();
  }, [albumViewsType, albumDateRange]);

  if (!snapshot || !chartData || !albumChartData) {
    return (
      <div className="photographer-dashboard-page">
        <h1>Dashboard</h1>
        <p className="desc">Failed to load dashboard data.</p>
      </div>
    );
  }

  // Function to generate chart options with y-axis configuration
  const getChartOptions = (title, maxValue) => {
    // Determine step size based on maxValue to avoid clutter
    let stepSize = 1;
    if (maxValue > 1000) {
      stepSize = Math.ceil(maxValue / 10);
    } else if (maxValue > 100) {
      stepSize = Math.ceil(maxValue / 10);
    }

    return {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
      },
      scales: {
        x: { 
          display: true,
          title: {
            display: false,
          },
        },
        y: {
          beginAtZero: true, // Start y-axis at 0
          ticks: {
            stepSize: stepSize, // Dynamic step size
            callback: function(value) {
              if (Number.isInteger(value)) {
                return value;
              }
              return null; // Skip labels that are not whole numbers
            },
          },
        },
      },
    };
  };

  return (
    <div className="photographer-dashboard-page">
      <h1>Dashboard</h1>
      <p className="desc">
        Welcome {firstname}, see your profile's performance here.
      </p>

      {/* Snapshot Cards */}
      <div className="snapshot-cards-container">
        <div className="snapshot-card">
          <p>{snapshot.totalProfileViews}</p>
          <h3>Total Profile Views</h3>
        </div>
        <div className="snapshot-card">
          <p>{snapshot.totalAlbumViews}</p>
          <h3>Total Album Views</h3>
        </div>
        <div className="snapshot-card">
          <p>{snapshot.totalPhotoViews}</p>
          <h3>Total Photo Views</h3>
        </div>
        <div className="snapshot-card">
          <p>{snapshot.totalLikes}</p>
          <h3>Total Photo Likes</h3>
        </div>
        <div className="snapshot-card">
          <p>{snapshot.totalAlbumFavourites}</p>
          <h3>Total Album Favourites</h3>
        </div>
      </div>

      {/* Chart of Photo Views Over Selected Date Range */}
      <div className="chart-container">
        <div className="photo-chart-container">
          <h2>Photo Views</h2>
          
          {/* Dropdowns for Photo Views */}
          <div className="chart-controls dashboard-filters-container">
            <label>
              Views Type
              <select 
                value={photoViewsType} 
                onChange={(e) => setPhotoViewsType(e.target.value)} 
                className="custom-select"
              >
                <option value="total">Total Views</option>
                <option value="unique">Unique Views</option>
              </select>
            </label>
            <label>
              Date Range
              <select 
                value={photoDateRange} 
                onChange={(e) => setPhotoDateRange(Number(e.target.value))} 
                className="custom-select"
              >
                <option value={7}>Last 7 Days</option>
                <option value={30}>Last 30 Days</option>
                <option value={90}>Last 90 Days</option>
              </select>
            </label>
          </div>

          <Line
            data={{
              labels: photoChart.labels,
              datasets: [
                {
                  label: photoViewsType === 'total' ? 'Total Views' : 'Unique Views',
                  data: photoChart.values,
                  fill: false,
                  borderColor: 'rgb(0, 0, 0)',
                  tension: 0.2,
                },
              ],
            }}
            options={getChartOptions(
              photoViewsType === 'total' ? 'Total Photo Views Over Time' : 'Unique Photo Views Over Time',
              Math.max(...photoChart.values)
            )}
          />
        </div>

        {/* Chart of Album Views Over Selected Date Range */}
        <div className="album-chart-container">
          <h2>Album Views</h2>
          
          {/* Dropdowns for Album Views */}
          <div className="chart-controls dashboard-filters-container">
            <label>
              Views Type
              <select 
                value={albumViewsType} 
                onChange={(e) => setAlbumViewsType(e.target.value)} 
                className="custom-select"
              >
                <option value="total">Total Views</option>
                <option value="unique">Unique Views</option>
              </select>
            </label>
            <label>
              Date Range
              <select 
                value={albumDateRange} 
                onChange={(e) => setAlbumDateRange(Number(e.target.value))} 
                className="custom-select"
              >
                <option value={7}>Last 7 Days</option>
                <option value={30}>Last 30 Days</option>
                <option value={90}>Last 90 Days</option>
              </select>
            </label>
          </div>

          <Line
            data={{
              labels: albumChart.labels,
              datasets: [
                {
                  label: albumViewsType === 'total' ? 'Total Album Views' : 'Unique Album Views',
                  data: albumChart.values,
                  fill: false,
                  borderColor: 'rgb(0, 0, 0)',
                  tension: 0.2,
                },
              ],
            }}
            options={getChartOptions(
              albumViewsType === 'total' ? 'Total Album Views Over Time' : 'Unique Album Views Over Time',
              Math.max(...albumChart.values)
            )}
          />
        </div>
      </div>

      {/* Top Albums Section */}
      <div className="top-albums-section">
        <h2>
          {topAlbums.length > 5 ? 'Top 5 Most Viewed Albums' : 'Your Albums Ranked by Views'}
        </h2>

        {/* Dropdowns for Top Albums Filters */}
        <div className="top-albums-filters dashboard-filters-container">
          <label>
            Views Type
            <select 
              value={topAlbumsViewsType} 
              onChange={(e) => setTopAlbumsViewsType(e.target.value)} 
              className="custom-select"
            >
              <option value="total">Total Views</option>
              <option value="unique">Unique Views</option>
            </select>
          </label>
          <label>
            Date Range
            <select 
              value={topAlbumsDateRange} 
              onChange={(e) => setTopAlbumsDateRange(e.target.value)} 
              className="custom-select"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>
          </label>
        </div>

        {/* Loading and Error States */}
        {topAlbumsLoading && <p className='dashboard-loading'>Calculating</p>}
        {topAlbumsError && <p className="error">{topAlbumsError}</p>}

        {/* Top Albums List/Table */}
        {!topAlbumsLoading && !topAlbumsError && topAlbums.length > 0 && (
          <table className="top-albums-table">
            <thead>
              <tr>
                <th>Album Name</th>
                <th>Category</th>
                <th>{topAlbumsViewsType === 'total' ? 'Total Views' : 'Unique Views'}</th>
                <th>Manage</th>
              </tr>
            </thead>
            <tbody>
              {topAlbums.map(album => (
                <tr key={album.id}>
                  <td>{album.title}</td>
                  <td>{album.category}</td>
                  <td>{album.viewCount}</td>
                  <td>
                    <Link href={`/${username.toLowerCase()}/albums/${album.slug}`} passHref target="_blank" rel="noopener noreferrer">
                     View Album
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* No Albums with Views */}
        {!topAlbumsLoading && !topAlbumsError && topAlbums.length === 0 && (
          <p className='analytics-placeholder'>No albums with views found for the selected filters.</p>
        )}
      </div>

      {/* Top Photos Section */}
      <div className="top-photos-section">
        <h2>
          {topPhotos.length > 10 ? 'Top 10 Most Viewed Photos' : 'Your Photos Ranked by Views'}
        </h2>

        {/* Dropdowns for Top Photos Filters */}
        <div className="top-photos-filters dashboard-filters-container">
          <label>
            Views Type
            <select 
              value={topPhotosViewsType} 
              onChange={(e) => setTopPhotosViewsType(e.target.value)} 
              className="custom-select"
            >
              <option value="total">Total Views</option>
              <option value="unique">Unique Views</option>
            </select>
          </label>
          <label>
            Date Range
            <select 
              value={topPhotosDateRange} 
              onChange={(e) => setTopPhotosDateRange(e.target.value)} 
              className="custom-select"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>
          </label>
        </div>

        {/* Loading and Error States */}
        {topPhotosLoading && <p className='dashboard-loading'>Calculating</p>}
        {topPhotosError && <p className="error">{topPhotosError}</p>}

        {/* Top Photos List/Table */}
        {!topPhotosLoading && !topPhotosError && topPhotos.length > 0 && (
          <table className="top-photos-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Category</th> 
                <th>{topPhotosViewsType === 'total' ? 'Total Views' : 'Unique Views'}</th>
                <th>Manage</th>
              </tr>
            </thead>
            <tbody>
              {topPhotos.map(photo => (
                <tr key={photo.id}>
                  <td>
                    {/* Using Next.js Image component for optimized image loading */}
                    <Image 
                      src={photo.thumbnailUrl} 
                      alt={photo.title} 
                      width={100} 
                      height={100} 
                      className="photo-thumbnail" 
                    />
                  </td>
                  <td>{photo.category}</td> {/* Display Category */}
                  <td>{photo.viewCount}</td>
                  <td>
                    <Link href={`/${username.toLowerCase()}/albums/${photo.albumSlug}`} passHref target="_blank" rel="noopener noreferrer">
                      View in Album
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* No Photos with Views */}
        {!topPhotosLoading && !topPhotosError && topPhotos.length === 0 && (
          <p className='analytics-placeholder'>No photos with views found for the selected filters.</p>
        )}
      </div>

      {/* Top Liked Photos Section */}
      <div className="top-liked-photos-section">
        <h2>
          {topLikedPhotos.length > 10 ? 'Top 10 Most Liked Photos' : 'Your Photos Ranked by Likes'}
        </h2>

        {/* Dropdowns for Top Liked Photos Filters */}
        <div className="top-liked-photos-filters dashboard-filters-container">
          <label>
            Date Range
            <select 
              value={topLikedPhotosDateRange} 
              onChange={(e) => setTopLikedPhotosDateRange(e.target.value)} 
              className="custom-select"
            >
              <option value="all">All Time</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
          </label>
        </div>

        {/* Loading and Error States */}
        {topLikedPhotosLoading && <p className='dashboard-loading'>Calculating</p>}
        {topLikedPhotosError && <p className="error">{topLikedPhotosError}</p>}

        {/* Top Liked Photos List/Table */}
        {!topLikedPhotosLoading && !topLikedPhotosError && topLikedPhotos.length > 0 && (
          <table className="top-liked-photos-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Category</th>
                <th>Likes</th>
                <th>Manage</th>
              </tr>
            </thead>
            <tbody>
              {topLikedPhotos.map(photo => (
                <tr key={photo.id}>
                  <td>
                    {/* Using Next.js Image component for optimized image loading */}
                    <Image 
                      src={photo.thumbnailUrl} 
                      alt={photo.title} 
                      width={100} 
                      height={100} 
                      className="photo-thumbnail" 
                    />
                  </td>
                  <td>{photo.category}</td>
                  <td>{photo.likeCount}</td>
                  <td>
                    <Link href={`/${username.toLowerCase()}/albums/${photo.albumSlug}`} passHref target="_blank" rel="noopener noreferrer">
                      View in Album
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* No Photos with Likes */}
        {!topLikedPhotosLoading && !topLikedPhotosError && topLikedPhotos.length === 0 && (
          <p className='analytics-placeholder'>No photos with likes found for the selected filters.</p>
        )}
      </div>
    </div>
  );
}

Dashboard.propTypes = {
  snapshot: PropTypes.shape({
    totalProfileViews: PropTypes.number.isRequired,
    totalAlbumViews: PropTypes.number.isRequired,
    totalPhotoViews: PropTypes.number.isRequired,
    totalLikes: PropTypes.number.isRequired,
    totalAlbumFavourites: PropTypes.number.isRequired,
  }),
  chartData: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    values: PropTypes.arrayOf(PropTypes.number).isRequired,
  }),
  albumChartData: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    values: PropTypes.arrayOf(PropTypes.number).isRequired,
  }),
  firstname: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};