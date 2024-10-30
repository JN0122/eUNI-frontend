import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
    const { isAuthTokenActive } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthTokenActive) {
            navigate("/login");
        }
    }, [isAuthTokenActive, navigate]);

    if (!isAuthTokenActive) return null;

    return <>{children}</>;
}

export default ProtectedRoute;
