import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
    const { isAuthTokenActive, restoreSession } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthTokenActive) {
            restoreSession().catch(() => {
                console.warn("Could not restore session");
                navigate("/login");
            });
        }
    }, [isAuthTokenActive, restoreSession, navigate]);

    if (!isAuthTokenActive) return null;

    return <>{children}</>;
}

export default ProtectedRoute;
