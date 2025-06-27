import axios from 'axios';

const API_URL = 'https://luckyapi-fje0bxcph0gyfmf3.germanywestcentral-01.azurewebsites.net/api';

// Create an Axios instance with base URL and default headers
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach JWT token to request headers if available
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 Unauthorized responses by removing token and redirecting to login
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

export default apiClient;