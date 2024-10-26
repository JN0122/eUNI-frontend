import axios from "./axios.js";

async function sendAndHandleRequest(axiosMethod, ...args) {
    try {
        const apiResponse = await axiosMethod(...args);
        return { status: apiResponse.status, data: apiResponse.data };
    } catch (error) {
        return { status: error.status, data: error.message };
    }
}

export async function loginUser(credentials) {
    return await sendAndHandleRequest(
        axios.post,
        `/api/Auth/login`,
        credentials,
    );
}

export async function logoutUser() {
    return await sendAndHandleRequest(axios.post, `/api/Auth/logout`);
};
