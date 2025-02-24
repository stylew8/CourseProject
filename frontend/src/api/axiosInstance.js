import axios from 'axios';

const API_BASE_URL = 'https://uniqum.school/api';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || API_BASE_URL,
    withCredentials: true,
});

export default axiosInstance;
