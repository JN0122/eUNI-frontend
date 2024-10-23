import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const loginUser = async (credentials) => {
    try {
        return await axios.post(`${API_URL}/api/Auth/login`, credentials);
    } catch (error) {
        console.error(error.message);
    }
};