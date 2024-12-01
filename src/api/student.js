import axiosInstance from "./axios.js";

export async function getStudentData() {
    return await axiosInstance.get(`/api/Student/info`);
}

export async function changeStudentGroup(payload) {
    return await axiosInstance.post(`/api/Student/group`, payload);
}

export async function changeCurrentFieldOfStudy(id) {
    return await axiosInstance.post(
        `/api/Student/current-field-of-study/${id}`
    );
}
