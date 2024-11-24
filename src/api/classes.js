import axiosInstance from "./axios.js";

export async function getClasses(fieldOfStudyLogId) {
    return await axiosInstance.get(`/api/Representative/classes`, {
        params: { fieldOfStudyLogId }
    });
}
