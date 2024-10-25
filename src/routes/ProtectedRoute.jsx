import {useAuth} from "../context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

function ProtectedRoute({children}) {
    const {user} = useAuth();
    const navigate = useNavigate();

    useEffect(()=> {
        if(user === null) {
            navigate("/login");
        }
    }, [user, navigate])

    if (!user) return null;

    return <>{children}</>;
}

export default ProtectedRoute;