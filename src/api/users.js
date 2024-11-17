import axiosInstance from "./axios.js";

export async function getAllUsers() {
    return await axiosInstance.get("/api/Users/all-users");
}

export async function deleteUser(id) {
    return await axiosInstance.delete(`/api/Users/${id}`);
}

export async function updateUser(id, data) {
    return await axiosInstance.patch(`/api/Users/${id}`, data);
}

export async function createUser(data) {
    return await axiosInstance.post(`/api/Users/create-user`, data);
}
