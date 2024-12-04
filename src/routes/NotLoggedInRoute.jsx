import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth.jsx";
import { useNavigate } from "react-router-dom";

export default function NotLoggedInRoute({ children }) {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) return;
        navigate("/");
    }, [isAuthenticated, navigate]);

    return children;
}
