import axiosInstance from "./axios.js";

export async function getUserData() {
    return await axiosInstance.get(`/api/User/get-user-basic-info`);
}
