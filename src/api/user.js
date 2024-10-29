export async function getUserData() {
    /*return await sendAndHandleRequest(
        axiosInstance.get,
        `/api/User/get-user-basic-info`,
    );*/
    return {
        firstname: "Adam",
        lastname: "Nowak",
        email: "adam.nowak@pk.edu.pl",
    };
}
