import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL 
    ? `${import.meta.env.VITE_BACKEND_URL}/api/books`
    : 'https://fullstack-test-backend.onrender.com/api/books';

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(request => {
    console.log('Starting Request:', request.url);
    return request;
});

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
    response => {
        console.log('Response:', response.status, response.data);
        return response;
    },
    error => {
        console.error('API Error:', {
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
            url: error.config?.url
        });
        return Promise.reject(error);
    }
);

export const getAllBooks = async () => {
    try {
        const response = await axiosInstance.get('');
        return response.data;
    } catch (error) {
        console.error('Error fetching books:', error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch books. Please try again.');
    }
};

export const addBook = async (bookData) => {
    try {
        const response = await axiosInstance.post('', bookData);
        return response.data;
    } catch (error) {
        if (error.response?.status === 409) {
            throw new Error('A book with this title and author already exists');
        }
        throw new Error(error.response?.data?.message || 'Failed to add book. Please try again.');
    }
};

export const updateBook = async (id, bookData) => {
    try {
        const response = await axiosInstance.put(`/${id}`, bookData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update book. Please try again.');
    }
};

export const deleteBook = async (id) => {
    try {
        const response = await axiosInstance.delete(`/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete book. Please try again.');
    }
};