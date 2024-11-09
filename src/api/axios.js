import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5104",
});

let isAuthenticated = false;

export function isUserAuthenticated() {
    return isAuthenticated;
}

export function setAuthHeader(token) {
    axiosInstance.defaults.headers.common.Authorization = token
        ? `Bearer ${token}`
        : null;
    isAuthenticated = !!token;
}

export async function restoreSession() {
    let token = null;
    try {
        const response = await axiosInstance.post(
            "/api/Auth/refresh-token",
            {},
            {
                withCredentials: true,
            },
        );
        token = response.data.accessToken;
    } catch {
        console.warn("Could not restore session");
    }
    setAuthHeader(token);
}

await restoreSession();

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.startsWith("/api/Auth")
        ) {
            originalRequest._retry = true;

            try {
                await restoreSession();
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error("Error when refreshing token: ", refreshError);
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    },
);

export default axiosInstance;
