import { createContext, useContext, useState } from "react";
import { loginUser, logoutUser } from "../api/api.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

    async function login(userData) {
        const response = await loginUser(userData);

        if (response?.status === 200) {
            setUser(response.data);
            localStorage.setItem("user", JSON.stringify(response.data));
        } else {
            console.error(`${response.status}: ${response.data}`);
        }
        return response;
    }

    async function logout() {
        const response = await logoutUser();
        if (response?.status === 200) {
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
