import axiosInstance from "./axios.js";

export async function getAllUsers() {
    return await axiosInstance.get("/api/Users/all-users");
}
