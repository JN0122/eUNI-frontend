import axiosInstance from "../lib/axios/axios.js";

export async function getAllUsers() {
    return await axiosInstance.get("/api/Admin/users");
}

export async function deleteUser(id) {
    return await axiosInstance.delete(`/api/Admin/users/${id}`);
}

export async function updateUser(id, data) {
    return await axiosInstance.patch(`/api/Admin/users/${id}`, data);
}

export async function createUser(data) {
    return await axiosInstance.post(`/api/Admin/users`, data);
}
