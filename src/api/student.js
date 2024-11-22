import axiosInstance from "./axios.js";

export async function getStudentInfo() {
    return await axiosInstance.get(`/api/Student/info`);
}
