import axiosInstance from "./axios.js";

export async function getStudentFieldsOfStudy(userId) {
    return await axiosInstance.get(`/api/Student/student-fields-of-study`, {
        params: { userId }
    });
}

export async function getStudentGroups(userId, fieldOfStudyLogId) {
    return await axiosInstance.get(`/api/Student/student-groups/`, {
        params: { userId, fieldOfStudyLogId }
    });
}
