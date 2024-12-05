import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
});

export function setAuthHeader(token) {
    axiosInstance.defaults.headers.common.Authorization = token
        ? `Bearer ${token}`
        : null;
}

export default axiosInstance;
