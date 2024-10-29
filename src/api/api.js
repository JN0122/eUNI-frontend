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
    return await sendAndHandleRequest(
        axiosInstance.post,
        "/api/Auth/refresh-token",
        {},
        {
            withCredentials: true,
        },
    );
}

export async function getUserData() {
    /*return await sendAndHandleRequest(
        axiosInstance.get,
        `/api/User/get-user-basic-info`,
    );*/
    return {
        firstname: "Adam",
        lastname: "Nowak",
        email: "adam.nowak@pk.edu.pl",
    };
}
