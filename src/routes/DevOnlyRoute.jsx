import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function DevOnlyRoute({ children }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (!import.meta.env.DEV) {
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    if (!import.meta.env.DEV) {
        return null;
    }

    return children;
}
