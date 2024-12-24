// lib/axios.js

import axios from 'axios';

const axiosInstance = axios.create({
  withCredentials: true, // Ensure cookies are sent with each request
});

export default axiosInstance;
