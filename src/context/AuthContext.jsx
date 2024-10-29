import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, logoutUser } from "../api/auth.js";
import { setupAxiosInterceptors } from "../api/axios.js";
import { getUserData } from "../api/user.js";

const AuthContext = createContext();

let currentToken = null;

export function AuthProvider({ children }) {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        setupAxiosInterceptors(currentToken);
    }, [currentToken]);

    async function login(userData) {
        const apiResponse = await loginUser(userData);
        currentToken = apiResponse.data.accessToken;

        if (apiResponse.status === 200) {
            const userDataResponse = await getUserData();
            setUserInfo(userDataResponse.data);
        } else {
            console.error(`${apiResponse.status}: ${apiResponse.data}`);
        }
        return apiResponse;
    }

    async function logout() {
        const apiResponse = await logoutUser();
        if (apiResponse.status === 200) {
            setUserInfo(null);
            currentToken = null;
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user: userInfo,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
