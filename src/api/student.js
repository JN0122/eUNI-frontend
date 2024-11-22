import axiosInstance from "./axios.js";

export async function getStudentData() {
    return await axiosInstance.get(`/api/Student/info`);
}
