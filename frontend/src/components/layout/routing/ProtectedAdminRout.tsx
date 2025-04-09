import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { authStore } from "../../../redux/authState";
import { jwtDecode } from "jwt-decode";
import authService from "../../../services/authService";

function AdminRoute({ element }: { element: JSX.Element }) {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isChecking, setIsChecking] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function checkAdmin() {
            const token = authStore.getState().token;
            if (!token) {
                navigate('/');
                return;
            }

            try {
                const user = jwtDecode<{ user: any }>(token).user;
                const userAdmin = await authService.isAdmin(user.userId);

                setIsAdmin(userAdmin);
                if (!userAdmin) {
                    navigate('/');
                }
            } catch (error) {
                navigate('/');
            } finally {
                setIsChecking(false);
            }
        }

        checkAdmin();
    }, [navigate]);

    if (isChecking) {
        return <NavLink to="*"></NavLink>;
    }

    return isAdmin ? element : null;
}

export default AdminRoute;