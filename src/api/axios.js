import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5104",
});

export const setupAxiosInterceptors = (currentToken) => {
    axiosInstance.interceptors.request.use(
        (config) => {
            if (currentToken) {
                config.headers["Authorization"] = `Bearer ${currentToken}`;
            }
            return config;
        },
        (error) => Promise.reject(error),
    );

    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (
                error.response?.status === 401 &&
                !originalRequest._retry &&
                originalRequest.url !== "/api/Auth/refresh-token"
            ) {
                originalRequest._retry = true;

                try {
                    const response = await axiosInstance.post(
                        "/api/Auth/refresh-token",
                        {},
                        { withCredentials: true },
                    );

                    const newAccessToken = response.data.accessToken;
                    currentToken = newAccessToken;

                    originalRequest.headers["Authorization"] =
                        `Bearer ${newAccessToken}`;
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    console.error(
                        "Error when refreshing token: ",
                        refreshError,
                    );
                    currentToken = null;
                    window.location.href = "/login";
                }
            }
            return Promise.reject(error);
        },
    );
};

export default axiosInstance;
