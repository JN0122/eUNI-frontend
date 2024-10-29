import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5104",
});

export default axiosInstance;
