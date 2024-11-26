import axiosInstance from "./axios.js";

export async function getStudentData() {
    return await axiosInstance.get(`/api/Student/info`);
}

export async function changeStudentGroup(payload) {
    return await axiosInstance.post(`/api/Student/group`, payload);
}
