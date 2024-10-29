import { createContext, useContext, useState } from "react";
import { getNewAuthToken, loginUser, logoutUser } from "../api/auth.js";
import { getUserData } from "../api/user.js";

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

    async function refreshAuthToken() {
        const apiResponse = await getNewAuthToken();

        if (apiResponse.status !== 200) throw new Error("Not logged in");

        setUserInfo((prev) => {
            return {
                ...prev,
                token: apiResponse.data.accessToken,
            };
        });
    }

    return (
        <AuthContext.Provider
            value={{
                user: userInfo.user,
                login,
                logout,
                refreshAuthToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
