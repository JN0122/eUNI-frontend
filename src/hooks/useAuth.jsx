import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState
} from "react";
import { loginUser, logoutUser, restoreAccessToken } from "../api/auth.js";
import { setAuthHeader } from "../api/axios.js";

const UseAuth = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    const restoreSession = useCallback(async function () {
        let token = null;
        try {
            const response = await restoreAccessToken();
            token = response.data.accessToken;
            setIsAuthenticated(true);
        } catch {
            console.warn("Could not restore session");
            setIsAuthenticated(false);
        }
        setAuthHeader(token);
    }, []);

    const login = useCallback(async function (userData) {
        let status;
        try {
            const apiResponse = await loginUser(userData);
            if (!apiResponse.data?.accessToken)
                return console.error("Cannot read access token");
            setAuthHeader(apiResponse.data.accessToken);
            setIsAuthenticated(true);
            status = apiResponse.status;
        } catch (error) {
            status = error.status;
        }
        return { status };
    }, []);

    const logout = useCallback(async function () {
        await logoutUser();
        setAuthHeader(null);
        setIsAuthenticated(false);
    }, []);

    useEffect(() => {
        restoreSession();
    }, [restoreSession]);

    return (
        <UseAuth.Provider
            value={{
                login,
                logout,
                isAuthenticated
            }}
        >
            {children}
        </UseAuth.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(UseAuth);
    if (!context) {
        throw new Error("Cannot use UseAuth without provider");
    }
    return context;
};
