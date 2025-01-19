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

// Register Chart.js components
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

  if (!snapshot || !chartData) {
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
          <h3>Total Profile Views</h3>
          <p>{snapshot.totalProfileViews}</p>
        </div>
        <div className="snapshot-card">
          <h3>Total Album Views</h3>
          <p>{snapshot.totalAlbumViews}</p>
        </div>
        <div className="snapshot-card">
          <h3>Total Photo Views</h3>
          <p>{snapshot.totalPhotoViews}</p>
        </div>
        <div className="snapshot-card">
          <h3>Total Likes</h3>
          <p>{snapshot.totalLikes}</p>
        </div>
        <div className="snapshot-card">
          <h3>Total Favourites</h3>
          <p>{snapshot.totalFavourites}</p>
        </div>
      </div>

      {/* Chart of Photo Views Over the Last 7 Days */}
      <div className="chart-container">
        <div className="photo-chart-container">
            <h2>Daily Photo Views (Last 7 Days)</h2>
            <Line
            data={{
                labels: chartData.labels,
                datasets: [
                {
                    label: 'Views',
                    data: chartData.values,
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

        <div className="album-chart-container">
            <h2>Daily Album Views (Last 7 Days)</h2>
            <Line
            data={{
            labels: albumChartData.labels,
            datasets: [
              {
                label: 'Album Views',
                data: albumChartData.values,
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

// Dashboard.propTypes = {
//     snapshot: PropTypes.shape({
//       totalProfileViews: PropTypes.number.isRequired,
//       totalAlbumViews: PropTypes.number.isRequired,
//       totalPhotoViews: PropTypes.number.isRequired,
//       totalLikes: PropTypes.number.isRequired,
//       totalFavourites: PropTypes.number.isRequired,
//     }),
//     chartData: PropTypes.shape({
//       labels: PropTypes.arrayOf(PropTypes.string).isRequired,
//       values: PropTypes.arrayOf(PropTypes.number).isRequired,
//     }),
//     albumChartData: PropTypes.shape({
//       labels: PropTypes.arrayOf(PropTypes.string).isRequired,
//       values: PropTypes.arrayOf(PropTypes.number).isRequired,
//     }),
//     firstname: PropTypes.string.isRequired,
//   };