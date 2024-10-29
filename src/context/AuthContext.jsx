import { createContext, useContext, useState } from "react";
import { getUserData, loginUser, logoutUser } from "../api/api.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [userInfo, setUserInfo] = useState({ token: null, user: null });

    async function login(userData) {
        const apiResponse = await loginUser(userData);

        if (apiResponse.status === 200) {
            const user = await getUserData();
            setUserInfo(() => {
                return {
                    user,
                    token: apiResponse?.data?.accessToken || null,
                };
            });
        } else {
            console.error(`${apiResponse.status}: ${apiResponse.data}`);
        }
        return apiResponse;
    }

    async function logout() {
        const apiResponse = await logoutUser();
        if (apiResponse.status === 200) {
            setUserInfo({ token: null, user: null });
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user: userInfo.user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
