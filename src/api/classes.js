import axiosInstance from "./axios.js";

export async function getClasses(fieldOfStudyLogId) {
    return await axiosInstance.get(`/api/Representative/classes`, {
        params: { fieldOfStudyLogId }
    });
}

export async function createClasses(payload) {
    return await axiosInstance.post(`/api/Representative/classes/`, payload);
}

export async function updateClasses(id, payload) {
    return await axiosInstance.put(
        `/api/Representative/classes/${id}`,
        payload
    );
}

export async function deleteClasses(id) {
    return await axiosInstance.delete(`/api/Representative/classes/${id}`);
}
