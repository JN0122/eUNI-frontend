import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from "react";
import {
    loginUser,
    logoutUser,
    registerUser,
    restoreAccessToken
} from "../api/auth.js";
import { setAuthHeader } from "../lib/axios/axios.js";

const UseAuth = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    let refreshPromise = useRef(null);

    const authenticate = function (token) {
        setIsAuthenticated(true);
        setAuthHeader(token);
    };

    const deauthenticate = function () {
        setIsAuthenticated(false);
        setAuthHeader(null);
    };

    const restoreSession = useCallback(() => {
        if (refreshPromise.current !== null) return refreshPromise.current;
        refreshPromise.current = restoreAccessToken()
            .then(({ data }) => authenticate(data?.accessToken))
            .catch(() => deauthenticate())
            .finally(() => {
                refreshPromise.current = null;
            });
        return refreshPromise.current;
    }, []);

    useEffect(() => {
        if (isAuthenticated == null) restoreSession();
    }, [isAuthenticated, restoreSession]);

    const register = useCallback(async function (registerRequest) {
        const { data } = await registerUser(registerRequest);
        authenticate(data?.accessToken);
    }, []);

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
                register,
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
