import { useEffect, useState } from "react";
import "./AuthMenu.css";
import { NavLink } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { authStore } from "../../../redux/authState";
import authService from "../../../services/authService";
import notify from "../../../services/Notify";

function AuthMenu(): JSX.Element {

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
        <div className="AuthMenu">
            <div className="logo">
                <p>כרטיסי ביקור דיגיטלים</p>
            </div>
            <div className="nav">
                <ul>
                    <li><a href="#">בית</a></li>
                    <li><a href="#">אודות</a></li>
                    <li><a href="#">שירותים</a></li>
                    <li><a href="#">צור קשר</a></li>
                </ul>
            </div>
            <div className="UserActions">
                <div className="HelloUser">
                    {user ? (
                        <span className="NavLogged">שלום, {user.firstName} {user.lastName}</span>
                    ) : (
                        <div className="UserLogin">
                            <NavLink to="/login" className="NavLogin"><span>התחבר</span></NavLink>
                            <div className="NavLoginIcon"><i className="fa-solid fa-right-to-bracket"></i></div>
                        </div>
                    )}
                </div>
                {user && (
                    <div className="NavLogged">
                        <NavLink to="/" className="action"><div >לוח הבקרה</div></NavLink>
                        <NavLink to="/home" className="action" onClick={() => logOut()}><div>התנתק</div></NavLink>
                    </div>
                )}
            </div>
        </div>

    )
}

export default AuthMenu;
