import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:3000/api' : '/api',
    withCredentials: true,
});

export const axiosInstancePy = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    withCredentials: true,
})