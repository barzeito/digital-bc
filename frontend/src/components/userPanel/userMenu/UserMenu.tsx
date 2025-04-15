import { useEffect, useState } from "react";
import "./UserMenu.css";
import { authStore } from "../../../redux/authState";
import { jwtDecode } from "jwt-decode";
import authService from "../../../services/authService";
import notify from "../../../services/popupMessage"
import { NavLink } from "react-router-dom";

function UserMenu(): JSX.Element {
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
        notify.success('!התנתקת מהמערכת בהצלחה');
    }
    return (
        <div className="UserMenu">
            <div className="UserTitle">
                {user && <span className="Title">שלום, {user.firstName} {user.lastName}</span>}
            </div>
            {user && (
                <div className="User">
                    <NavLink to={`/panel/user/${user.userId}`} className="NavCard">
                        <div className="NavIcon"><i className="fas fa-user"></i></div>
                        <div className="NavText">הכרטיס שלי</div>
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

export default UserMenu;
