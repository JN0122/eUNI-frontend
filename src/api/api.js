import axios from 'axios';

axios.defaults.baseURL = "http://localhost:5104";

export const loginUser = async (credentials) => {
    try {
        return await axios.post(`/api/Auth/login`, credentials);
    } catch (error) {
        return error.response;
    }
};