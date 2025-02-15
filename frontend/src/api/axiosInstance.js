import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || API_BASE_URL,
    withCredentials: true,
});

export default axiosInstance;
