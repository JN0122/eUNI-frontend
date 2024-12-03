import axiosInstance from "../lib/axios/axios.js";

export async function getSchedule(data) {
    return await axiosInstance.post("/api/Schedule/get-schedule", data);
}

export async function getHours() {
    return await axiosInstance.get("/api/Schedule/hours");
}

export async function getGroupCalendarPath(fieldOfStudyLogId, groupId) {
    return await axiosInstance.get("/api/Schedule/group-calendar-path", {
        params: { fieldOfStudyLogId, groupId }
    });
}
