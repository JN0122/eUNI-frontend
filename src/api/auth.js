import axiosInstance from "./axios.js";

export async function loginUser(credentials) {
    return await axiosInstance.post(`/api/Auth/login`, credentials, {
        withCredentials: true
    });
}

export async function logoutUser() {
    return await axiosInstance.post(
        `/api/Auth/logout`,
        {},
        {
            withCredentials: true
        }
    );
}
