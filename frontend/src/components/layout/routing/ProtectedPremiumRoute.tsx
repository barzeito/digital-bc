import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { authStore } from "../../../redux/authState";
import { jwtDecode } from "jwt-decode";
import authService from "../../../services/authService";
import notify from "../../../services/popupMessage";

function PremiumRoute({ element }: { element: JSX.Element }) {
    const [isPremium, setIsPremium] = useState<boolean>(false);
    const [isChecking, setIsChecking] = useState<boolean>(true);
    const params = useParams();
    const uId = String(params.userId);
    const navigate = useNavigate();

    useEffect(() => {
        async function checkPremium() {
            const token = authStore.getState().token;
            if (!token) {
                navigate(`/panel/user/${uId}`);
                return;
            }

            try {
                const user = jwtDecode<{ user: any }>(token).user;
                const userPremium = await authService.isPremium(user.userId);
                setIsPremium(userPremium);
                if (!userPremium) {
                    navigate(`/panel/user/${uId}`);
                    notify.error(".פונקציה זה זמינה רק למשתמשי פרימיום")
                }
            } catch (error) {
                navigate(`/panel/user/${uId}`);
            } finally {
                setIsChecking(false);
            }
        }

        checkPremium();
    }, [navigate,uId]);

    if (isChecking) {
        return <NavLink to={`/panel/user/${uId}`}></NavLink>;
    }

    return isPremium ? element : null;
}

export default PremiumRoute;