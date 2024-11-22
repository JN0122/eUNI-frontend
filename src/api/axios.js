import axios from "axios";
import { restoreAccessToken } from "./auth.js";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5104"
});

export function setAuthHeader(token) {
    axiosInstance.defaults.headers.common.Authorization = token
        ? `Bearer ${token}`
        : null;
}

async function restoreSession() {
    try {
        const response = await restoreAccessToken();
        const token = response.data.accessToken;
        setAuthHeader(token);
        return token;
    } catch {
        setAuthHeader(null);
        return null;
    }
}

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/api/Auth")
        ) {
            originalRequest._retry = true;

            try {
                const newToken = await restoreSession();
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error("Error when refreshing token: ", refreshError);
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
