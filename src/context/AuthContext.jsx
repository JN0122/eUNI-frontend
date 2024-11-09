import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { loginUser, logoutUser } from "../api/auth.js";
import { isUserAuthenticated, setAuthHeader } from "../api/axios.js";
import { getUserData } from "../api/user.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [userInfo, setUserInfo] = useState(null);

    const getUserInfo = useCallback(
        async function () {
            if (!isUserAuthenticated()) return;
            try {
                const response = await getUserData();
                setUserInfo(response.data);
            } catch {
                setUserInfo(null);
            }
        },
        [setUserInfo],
    );

    const login = useCallback(
        async function (userData) {
            let status;
            try {
                const apiResponse = await loginUser(userData);
                setAuthHeader(apiResponse.data.accessToken);
                await getUserInfo();
                status = apiResponse.status;
            } catch (error) {
                status = error.status;
            }
            return { status };
        },
        [getUserInfo],
    );

    const logout = useCallback(
        async function () {
            let status;
            try {
                const apiResponse = await logoutUser();
                setUserInfo(null);
                setAuthHeader(null);
                status = apiResponse.status;
            } catch (error) {
                status = error.status;
            }
            return { status };
        },
        [setUserInfo],
    );

    useEffect(() => {
        getUserInfo();
    }, [getUserInfo]);

    return (
        <AuthContext.Provider
            value={{
                userInfo,
                login,
                logout,
                isAuthenticated: isUserAuthenticated(),
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("Cannot use AuthContext without provider");
    }
    return context;
};
