import axiosInstance from "./axios.js";

async function sendAndHandleRequest(axiosMethod, ...args) {
    try {
        const apiResponse = await axiosMethod(...args);
        return { status: apiResponse.status, data: apiResponse.data };
    } catch (error) {
        return { status: error.status, data: error.message };
    }
}

export async function loginUser(credentials) {
    return await sendAndHandleRequest(
        axiosInstance.post,
        `/api/Auth/login`,
        credentials,
        {
            withCredentials: true,
        },
    );
}

export async function logoutUser() {
    return await sendAndHandleRequest(
        axiosInstance.post,
        `/api/Auth/logout`,
        {},
        {
            withCredentials: true,
        },
    );
}

export async function getNewAuthToken() {
    const response = await axiosInstance.post(
        "/api/Auth/refresh-token",
        {},
        {
            withCredentials: true,
        },
    );
    return response.data.accessToken;
}
