import { createContext, useContext, useState } from 'react';
import {loginUser} from "../../api/auth.js";

const AuthContext = createContext();

export function AuthProvider({ children }){
    const [userInfo, setUserInfo] = useState(null);

    async function login(userData) {
        const response = await loginUser(userData);

        if(response?.status === 200){
            setUserInfo(response.data);
        }else{
            console.error(`${response.status}: ${response.data}`);
        }
        return response;
    }

    async function logout() {
        setUserInfo(null);
    }

    return (
        <AuthContext.Provider value={{ userInfo, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);