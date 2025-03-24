import axiosInstance from "../lib/axios/axios.js";

export async function setRootPassword(payload) {
    return await axiosInstance.post(`/api/Setup/set-password`, payload);
}

export async function resetDb() {
    return await axiosInstance.post(`/api/Setup/reset-db`);
}
