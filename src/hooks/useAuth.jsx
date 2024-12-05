import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState
} from "react";
import { loginUser, logoutUser, restoreAccessToken } from "../api/auth.js";
import { setAuthHeader } from "../lib/axios/axios.js";

const UseAuth = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    const authenticate = function (token) {
        setIsAuthenticated(true);
        setAuthHeader(token);
    };

    const deauthenticate = function () {
        setIsAuthenticated(false);
        setAuthHeader(null);
    };

    const restoreSession = useCallback(async () => {
        try {
            const { data } = await restoreAccessToken();
            authenticate(data?.accessToken);
        } catch {
            deauthenticate();
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated == null) restoreSession();
    }, [isAuthenticated, restoreSession]);

    const login = useCallback(async function (userData) {
        const { data } = await loginUser(userData);
        authenticate(data?.accessToken);
    }, []);

    const logout = useCallback(async function () {
        await logoutUser();
        deauthenticate();
    }, []);

    return (
        <UseAuth.Provider
            value={{
                restoreSession,
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
