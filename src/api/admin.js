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

export async function getYears() {
    return await axiosInstance.get(`/api/Admin/years`);
}

export async function getNextAcademicYearDetails() {
    return await axiosInstance.get(`/api/Admin/next-semester-details`);
}

export async function getYearOrganizations() {
    return await axiosInstance.get(`/api/Admin/year-organizations`);
}

export async function createYearOrganization(data) {
    return await axiosInstance.post(`/api/Admin/year-organizations`, data);
}
