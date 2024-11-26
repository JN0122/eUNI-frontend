import axiosInstance from "./axios.js";

export async function getGroups(fieldOfStudyLogId) {
    return await axiosInstance.get(`/api/FieldOfStudy/groups`, {
        params: { fieldOfStudyLogId }
    });
}