import { createContext, useContext, useState } from "react";
import { loginUser, logoutUser } from "../api/api.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

    async function login(userData) {
        const apiResponse = await loginUser(userData);

        if (apiResponse.status === 200) {
            setUser(apiResponse.data);
            localStorage.setItem("user", JSON.stringify(apiResponse.data));
        } else {
            console.error(`${apiResponse.status}: ${apiResponse.data}`);
        }
        return apiResponse;
    }

    async function logout() {
        const apiResponse = await logoutUser();
        if (apiResponse.status === 200) {
            setUser(null);
            localStorage.removeItem("user");
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
