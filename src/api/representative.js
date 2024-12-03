import axiosInstance from "../lib/axios/axios.js";

export async function getAssignments(fieldOfStudyLogId) {
    return await axiosInstance.get(`/api/Representative/assignments`, {
        params: { fieldOfStudyLogId }
    });
}

export async function getAcademicDaysOff(fieldOfStudyLogId) {
    return await axiosInstance.get(
        `/api/Representative/academic-year-days-off`,
        {
            params: { fieldOfStudyLogId }
        }
    );
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

export async function getClasses(fieldOfStudyLogId) {
    return await axiosInstance.get(`/api/Representative/classes`, {
        params: { fieldOfStudyLogId }
    });
}

export async function createClass(payload) {
    return await axiosInstance.post(`/api/Representative/classes/`, payload);
}

export async function updateClass(id, payload) {
    return await axiosInstance.put(
        `/api/Representative/classes/${id}`,
        payload
    );
}

export async function deleteClass(id) {
    return await axiosInstance.delete(`/api/Representative/classes/${id}`);
}

export async function getAllGroups(fieldOfStudyLogId) {
    return await axiosInstance.get("/api/Representative/all-groups", {
        params: { fieldOfStudyLogId }
    });
}
