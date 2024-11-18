import axiosInstance from "./axios.js";

export async function getAllUsers() {
    return await axiosInstance.get("/api/Admin/all-users");
}

export async function deleteUser(id) {
    return await axiosInstance.delete(`/api/Admin/${id}`);
}

export async function updateUser(id, data) {
    return await axiosInstance.patch(`/api/Admin/${id}`, data);
}

export async function createUser(data) {
    return await axiosInstance.post(`/api/Admin/create-user`, data);
}
