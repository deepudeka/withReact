// client/src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api'; // Use Vite env var or proxy path

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add JWT token to requests
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('userToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ===== Auth APIs =====
export const register = async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    if (response.data && response.data.token) {
        localStorage.setItem('userToken', response.data.token);
        localStorage.setItem('userInfo', JSON.stringify({
            UserID: response.data.UserID,
            FullName: response.data.FullName,
            Email: response.data.Email,
            Role: response.data.Role
        }));
    }
    return response.data;
};

export const login = async (userData) => {
    const response = await apiClient.post('/auth/login', userData);
    if (response.data && response.data.token) {
        localStorage.setItem('userToken', response.data.token);
        localStorage.setItem('userInfo', JSON.stringify({
            UserID: response.data.UserID,
            FullName: response.data.FullName,
            Email: response.data.Email,
            Role: response.data.Role,
            ProfilePicture: response.data.ProfilePicture
        }));
    }
    return response.data;
};

export const getMyProfile = async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
};

// ===== Paper APIs =====

export const uploadNewPaper = async (formData) => {
    // formData should be a FormData object because it includes a file
    const response = await apiClient.post('/papers', formData, {
        headers: {
            'Content-Type': 'multipart/form-data', // Important for file uploads
        },
    });
    return response.data;
};

export const fetchPapers = async () => {
    const response = await apiClient.get('/papers');
    return response.data;
};

export const fetchPaperById = async (id) => {
    const response = await apiClient.get(`/papers/${id}`);
    return response.data;
};

export default apiClient;
