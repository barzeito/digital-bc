import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { AuthActionType, authStore } from "../redux/authState";


const TokenWatcher = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("dvcToken");
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                const now = Date.now() / 1000;

                if (decoded.exp < now) {
                    authStore.dispatch({ type: AuthActionType.tokenExpired, payload: null });
                    navigate("/");
                }
            } catch (error) {
                authStore.dispatch({ type: AuthActionType.tokenExpired, payload: null });
                navigate("/");
            }
        }
    })
    return null;
}

export default TokenWatcher;