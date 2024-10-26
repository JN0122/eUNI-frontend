import axios from "axios";

axios.defaults.baseURL = "http://localhost:5104";
axios.defaults.withCredentials = true;

export const loginUser = async (credentials) => {
    try {
        return await axios.post(`/api/Auth/login`, credentials);
    } catch (error) {
        return error.response;
    }
};

export const logoutUser = async () => {
    try {
        return await axios.post(`/api/Auth/logout`);
    } catch (error) {
        return error.response;
    }
};
