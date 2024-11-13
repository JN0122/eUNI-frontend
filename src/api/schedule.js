import axiosInstance from "./axios.js";

export async function getSchedule(data) {
    return await axiosInstance.post("/api/Schedule/get-schedule", data);
}
