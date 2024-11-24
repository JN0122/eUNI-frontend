import axiosInstance from "./axios.js";

export async function getAssignments(fieldOfStudyLogId) {
    return await axiosInstance.get(`/api/Representative/assignments`, {
        params: { fieldOfStudyLogId }
    });
}

export async function createAssignment(payload) {
    return await axiosInstance.post(
        `/api/Representative/assignments/`,
        payload
    );
}

export async function updateAssignment(id, payload) {
    return await axiosInstance.put(
        `/api/Representative/assignments/${id}`,
        payload
    );
}

export async function deleteAssignment(id) {
    return await axiosInstance.delete(`/api/Representative/assignments/${id}`);
}
