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
            <div className="UserAdmin">
                {user && <span className="Title">שלום, {user.firstName} {user.lastName}</span>}
            </div>
            {user && (
                <div className="User">
                    <NavLink to="/panel/admin" className="NavCard">
                        <div className="NavIcon"><i className="fas fa-home"></i></div>
                        <div className="NavText">בית</div>
                    </NavLink>
                    <NavLink to="/panel/admin/cards" className="NavCard">
                        <div className="NavIcon"><i className="fas fa-address-card"></i></div>
                        <div className="NavText">כרטיסים</div>
                    </NavLink>
                    <NavLink to="/panel/admin/users" className="NavCard">
                        <div className="NavIcon"><i className="fas fa-users"></i></div>
                        <div className="NavText">משתמשים</div>
                    </NavLink>
                    <NavLink to="/home" onClick={() => logOut()} className="NavCard">
                        <div className="NavIcon"><i className="fas fa-sign-out-alt"></i></div>
                        <div className="NavText">התנתק</div>
                    </NavLink>
                </div>
            )}
        </div>
    );
}

export default AdminMenu;
