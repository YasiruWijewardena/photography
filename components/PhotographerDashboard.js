// // components/Dashboard.js

// import '../styles/public/dashboard.css';
// import PropTypes from 'prop-types';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// } from 'chart.js';
// import { Line } from 'react-chartjs-2';

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// export default function Dashboard({ snapshot, chartData, albumChartData, firstname }) {

//   if (!snapshot || !chartData) {
//     return (
//       <div className="photographer-dashboard-page">
//         <h1>Dashboard</h1>
//         <p className="desc">Failed to load dashboard data.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="photographer-dashboard-page">
//       <h1>Dashboard</h1>
//       <p className="desc">
//         Welcome {firstname}, see your profile's performance here.
//       </p>

//       {/* Snapshot Cards */}
//       <div className="snapshot-cards-container">
//         <div className="snapshot-card">
//           <p>{snapshot.totalProfileViews}</p>
//           <h3>Total Profile Views</h3>
          
//         </div>
//         <div className="snapshot-card">
//         <p>{snapshot.totalAlbumViews}</p>
//           <h3>Total Album Views</h3>
          
//         </div>
//         <div className="snapshot-card">
//         <p>{snapshot.totalPhotoViews}</p>
//           <h3>Total Photo Views</h3>
          
//         </div>
//         <div className="snapshot-card">
//         <p>{snapshot.totalLikes}</p>
//           <h3>Total Photo Likes</h3>
          
//         </div>
//         <div className="snapshot-card">
//         <p>{snapshot.totalAlbumFavourites}</p>
//           <h3>Total Album Favourites</h3>
          
//         </div>
//       </div>

//       {/* Chart of Photo Views Over the Last 7 Days */}
//       <div className="chart-container">
//         <div className="photo-chart-container">
//             <h2>Daily Total Photo Views (Last 7 Days)</h2>
//             <Line
//             data={{
//                 labels: chartData.labels,
//                 datasets: [
//                 {
//                     label: 'Views',
//                     data: chartData.values,
//                     fill: false,
//                     borderColor: 'rgb(0, 0, 0)',
//                     tension: 0.2,
//                 },
//                 ],
//             }}
//             options={{
//                 responsive: true,
//                 plugins: {
//                 legend: {
//                     display: false,
//                 },
//                 },
//                 scales: {
//                 x: { display: true },
//                 y: { display: true },
//                 },
//             }}
//             />
//         </div>

//         <div className="album-chart-container">
//             <h2>Daily Total Album Views (Last 7 Days)</h2>
//             <Line
//             data={{
//             labels: albumChartData.labels,
//             datasets: [
//               {
//                 label: 'Album Views',
//                 data: albumChartData.values,
//                 fill: false,
//                 borderColor: 'rgb(0, 0, 0)',
//                 tension: 0.2,
//               },
//             ],
//           }}
//           options={{
//             responsive: true,
//             plugins: {
//               legend: {
//                 display: false,
//               },
//             },
//             scales: {
//               x: { display: true },
//               y: { display: true },
//             },
//           }}
//         />
//         </div>
        
//       </div>
//     </div>
//   );
// }

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard({ snapshot, chartData, albumChartData, firstname }) {
  // Initial States for Photo Views
  const [photoViewsType, setPhotoViewsType] = useState('total');
  const [photoDateRange, setPhotoDateRange] = useState(7);
  const [photoChart, setPhotoChart] = useState(chartData);

  // Initial States for Album Views
  const [albumViewsType, setAlbumViewsType] = useState('total');
  const [albumDateRange, setAlbumDateRange] = useState(7);
  const [albumChart, setAlbumChart] = useState(albumChartData);

  // Fetch Photo Views Data
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

  // Fetch Album Views Data
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
          <div className="chart-controls">
            <label>
              Views Type:
              <select value={photoViewsType} onChange={(e) => setPhotoViewsType(e.target.value)}>
                <option value="total">Total Views</option>
                <option value="unique">Unique Views</option>
              </select>
            </label>
            <label>
              Date Range:
              <select value={photoDateRange} onChange={(e) => setPhotoDateRange(Number(e.target.value))}>
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
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: { display: true },
                y: { display: true },
              },
            }}
          />
        </div>

        {/* Chart of Album Views Over Selected Date Range */}
        <div className="album-chart-container">
          <h2>Album Views</h2>
          
          {/* Dropdowns for Album Views */}
          <div className="chart-controls">
            <label>
              Views Type:
              <select value={albumViewsType} onChange={(e) => setAlbumViewsType(e.target.value)}>
                <option value="total">Total Views</option>
                <option value="unique">Unique Views</option>
              </select>
            </label>
            <label>
              Date Range:
              <select value={albumDateRange} onChange={(e) => setAlbumDateRange(Number(e.target.value))}>
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
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: { display: true },
                y: { display: true },
              },
            }}
          />
        </div>
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
};