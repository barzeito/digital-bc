import { useEffect, useState } from "react";
import "./AdminMenu.css";
import { authStore } from "../../../redux/authState";
import { jwtDecode } from "jwt-decode";
import authService from "../../../services/authService";
import notify from "../../../services/Notify";
import { NavLink } from "react-router-dom";

function AdminMenu(): JSX.Element {

    type User = {
        firstName: string;
        lastName: string;
        userId: string;
    }

    const [user, setUser] = useState<User>();

    useEffect(() => {
        const token = authStore.getState().token;
        if (token) {
            const user = jwtDecode<{ user: User }>(token).user;
            setUser(user);
        }
        const unsubscribe = authStore.subscribe(() => {
            const token = authStore.getState().token;
            if (token) {
                const user = jwtDecode<{ user: User }>(token).user;
                setUser(user);
            } else {
                setUser(undefined);
            }
        });
        return unsubscribe;
    }, [])

    function logOut() {
        authService.logout();
        notify.success('logged out successfully');
    }

    return (
        <div className="AdminMenu">
            <div className="UserHello">
                {user && <span className="Title">Hello, {user.firstName} {user.lastName}</span>}
            </div>
            {user && (
                <div className="User">
                    <NavLink to="/"><div>Home</div></NavLink>
                    <NavLink to="/home" onClick={() => logOut()}><div>Logout</div></NavLink>
                </div>
            )}
        </div>
    );
}

export default AdminMenu;
