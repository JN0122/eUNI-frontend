import {useAuth} from "../context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

function LoginOrDashboard() {
    const {user} = useAuth();
    const navigate = useNavigate();

    useEffect(()=> {
        if(user === null) {
            navigate("/login");
        }else{
            (navigate("/dashboard"));
        }
    }, [user, navigate])

    if (!user) return null;

    return <></>;
}

export default LoginOrDashboard;