import { useEffect, useState } from "react";
import "./AuthMenu.css";
import { NavLink } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { authStore } from "../../../redux/authState";
import authService from "../../../services/authService";
import notify from "../../../services/popupMessage"

function AuthMenu(): JSX.Element {

    type User = {
        firstName: string;
        lastName: string;
        userId: string;
    }

    const [user, setUser] = useState<User>();
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

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

    useEffect(() => {
        async function ifAdmin() {
            if (user) {
                try {
                    const userAdmin = await authService.isAdmin(user.userId);
                    setIsAdmin(userAdmin);
                } catch (error: any) {
                }
            }
        }
        ifAdmin();
    }, [user]);

    function logOut() {
        authService.logout();
        notify.success('!התנתקת מהמערכת בהצלחה');
    }

    return (
        <div className="AuthMenu">
            <div className="companyLogo">
                <p>כרטיסי ביקור דיגיטלים</p>
            </div>
            <div className="navigationItems">
                <ul>
                    <li><a href="#">בית</a></li>
                    <li><a href="#">אודות</a></li>
                    <li><a href="#">שירותים</a></li>
                    <li><a href="#home-contact-form-section">צור קשר</a></li>
                </ul>
            </div>
            <div className="menuItems">
                <div className="userDiv">
                    {user ? (
                        <span className="userItem">שלום, {user.firstName} {user.lastName}</span>
                    ) : (
                        <div className="loginButton">
                            <NavLink to="/login" className="NavLogin"><span>התחבר</span></NavLink>
                            <div className="NavLoginIcon"><i className="fa-solid fa-right-to-bracket"></i></div>
                        </div>
                    )}
                </div>
                {user && (
                    <div className="NavLogged">
                        <NavLink className="action" to={isAdmin ? "/panel/admin" : `/panel/user/${user.userId}`}>
                            <div>{isAdmin ? "פאנל ניהול" : "פאנל משתמש"}</div>
                        </NavLink>
                        <NavLink to="/home" className="action" onClick={() => logOut()}><div>התנתק</div></NavLink>
                    </div>
                )}
            </div>
        </div>

    )
}

export default AuthMenu;
