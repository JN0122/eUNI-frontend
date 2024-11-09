import axiosInstance from "./axios.js";

export async function getAllUsers() {
    return await axiosInstance.get("/api/Users/all-users");
}

export async function deleteUser(id) {
    return await axiosInstance.delete(`/api/Users/${id}`);
}
