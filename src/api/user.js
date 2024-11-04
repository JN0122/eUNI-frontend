import axiosInstance from "./axios.js";

export async function getUserData() {
    return await axiosInstance.get(`/api/User/user-info`);
}

export async function changeEmail(data) {
    return await axiosInstance.patch(`/api/User/change-email`, data);
}

export async function changePassword(data) {
    return await axiosInstance.patch(`/api/User/change-password`, data);
}
