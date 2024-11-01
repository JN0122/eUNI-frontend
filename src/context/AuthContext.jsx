import { createContext, useContext, useEffect, useState } from "react";
import { getNewAuthToken, loginUser, logoutUser } from "../api/auth.js";
import { setupAxiosInterceptors } from "../api/axios.js";
import { getUserData } from "../api/user.js";

const AuthContext = createContext();

let currentToken = null;

export function AuthProvider({ children }) {
    const [userInfo, setUserInfo] = useState(null);
    const [isAuthTokenActive, setIsAuthTokenActive] = useState(false);

    useEffect(() => {
        setupAxiosInterceptors(currentToken);
    }, [currentToken]);

    async function getUserInfo() {
        const response = await getUserData();
        if (response.status === 200) {
            setUserInfo(response.data);
        }
    }

    async function login(userData) {
        let status;
        try {
            const apiResponse = await loginUser(userData);
            currentToken = apiResponse.data.accessToken;
            setIsAuthTokenActive(true);
            getUserInfo();
            status = apiResponse.status;
        } catch (error) {
            status = error.status;
        }
        return { status };
    }

    async function logout() {
        let status;
        try {
            const apiResponse = await logoutUser();
            if (apiResponse.status === 200) {
                currentToken = null;
            }
            setUserInfo(false);
            setIsAuthTokenActive(false);
            status = apiResponse.status;
        } catch (error) {
            status = error.status;
        }
        return { status };
    }

    const restoreSession = function () {
        return new Promise((resolve, reject) => {
            getNewAuthToken()
                .then((value) => {
                    currentToken = value;
                    setIsAuthTokenActive(true);
                    getUserInfo();
                    resolve();
                })
                .catch(() => {
                    setIsAuthTokenActive(false);
                    reject();
                });
        });
    };

    return (
        <AuthContext.Provider
            value={{
                userInfo,
                login,
                logout,
                restoreSession,
                isAuthTokenActive,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
