import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL 
    ? `${import.meta.env.VITE_BACKEND_URL}/api/books`
    : 'https://fullstack-test-backend.onrender.com/api/books';

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getAllBooks = async () => {
    try {
        const response = await axiosInstance.get('');
        if (!response.data) {
            throw new Error('No data received from server');
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching books:', error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch books');
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
        throw new Error(error.response?.data?.message || 'Failed to add book');
    }
};

export const updateBook = async (id, bookData) => {
    try {
        const response = await axiosInstance.put(`/${id}`, bookData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update book');
    }
};

export const deleteBook = async (id) => {
    try {
        const response = await axiosInstance.delete(`/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete book');
    }
};