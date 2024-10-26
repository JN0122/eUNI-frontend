import axios from "axios";

axios.defaults.baseURL = "http://localhost:5104";
axios.defaults.withCredentials = true;

async function sendAndHandleRequest(axiosMethod, ...args) {
    try {
        const apiResponse = await axiosMethod(...args);
        return { status: apiResponse.status, data: apiResponse.data };
    } catch (error) {
        return { status: error.status, data: error.message };
    }
}

export const loginUser = async (credentials) => {
    return await sendAndHandleRequest(
        axios.post,
        `/api/Auth/login`,
        credentials,
    );
};

export const logoutUser = async () => {
    return await sendAndHandleRequest(axios.post, `/api/Auth/logout`);
};
