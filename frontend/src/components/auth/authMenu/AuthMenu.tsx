import { useEffect, useState } from "react";
import "./AuthMenu.css";
import { NavLink } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { authStore } from "../../../redux/authState";
import authService from "../../../services/authService";
import notify from "../../../services/popupMessage";
import logo from "../../../assets/images/wjs-logo.png"

function AuthMenu(): JSX.Element {
    type User = {
        firstName: string;
        lastName: string;
        userId: string;
    };

    const [user, setUser] = useState<User>();
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

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
    }, []);

    useEffect(() => {
        async function ifAdmin() {
            if (user) {
                try {
                    const userAdmin = await authService.isAdmin(user.userId);
                    setIsAdmin(userAdmin);
                } catch (error: any) {
                    // Error handling already in place
                }
            }
        }
        ifAdmin();
    }, [user]);

    // Close menu when a navigation item is clicked
    const handleNavClick = () => {
        setMenuOpen(false);
    };

    function logOut() {
        authService.logout();
        notify.success("!התנתקת מהמערכת בהצלחה");
        setMenuOpen(false);
    }

    return (
        <div className="AuthMenu">
            <div className="companyLogo">
                <img src={logo} alt="" />
                {/* <p>כרטיסי ביקור דיגיטלים</p> */}
            </div>

            {/* Mobile menu toggle button */}
            <div
                className="mobileMenuToggle"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? (
                    <i className="fa-solid fa-xmark"></i>
                ) : (
                    <i className="fa-solid fa-bars"></i>
                )}
            </div>

            <div className={`navigationItems ${menuOpen ? "open" : ""}`}>
                <ul>
                    <li><a href="#home-section" onClick={handleNavClick}>בית</a></li>
                    <li><a href="#who-are-we" onClick={handleNavClick}>אודות</a></li>
                    <li><a href="#services" onClick={handleNavClick}>שירותים</a></li>
                    <li><a href="#home-contact-form-section" onClick={handleNavClick}>צור קשר</a></li>
                </ul>

                {/* Mobile user menu - appears inside the navigation on mobile */}
                <div className="mobileUserMenu">
                    <div className="userDiv">
                        {user ? (
                            <span className="userItem">שלום, {user.firstName} {user.lastName}</span>
                        ) : (
                            <div className="loginButton">
                                <NavLink to="/login" className="NavLogin" onClick={handleNavClick}>
                                    <span>התחבר</span>
                                </NavLink>
                                <div className="NavLoginIcon">
                                    <i className="fa-solid fa-right-to-bracket"></i>
                                </div>
                            </div>
                        )}
                    </div>
                    {user && (
                        <div className="NavLogged">
                            <NavLink
                                className="action"
                                to={isAdmin ? "/panel/admin" : `/panel/user/${user.userId}`}
                                onClick={handleNavClick}
                            >
                                <div>{isAdmin ? "פאנל ניהול" : "פאנל משתמש"}</div>
                            </NavLink>
                            <NavLink
                                to="/home"
                                className="action"
                                onClick={() => logOut()}
                            >
                                <div>התנתק</div>
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>

            {/* Desktop user menu - only visible on desktop */}
            <div className="menuItems">
                <div className="userDiv">
                    {user ? (
                        <span className="userItem">שלום, {user.firstName} {user.lastName}</span>
                    ) : (
                        <div className="loginButton">
                            <NavLink to="/login" className="NavLogin" onClick={handleNavClick}>
                                <span>התחבר</span>
                            </NavLink>
                            <div className="NavLoginIcon">
                                <i className="fa-solid fa-right-to-bracket"></i>
                            </div>
                        </div>
                    )}
                </div>
                {user && (
                    <div className="NavLogged">
                        <NavLink
                            className="action"
                            to={isAdmin ? "/panel/admin" : `/panel/user/${user.userId}`}
                            onClick={handleNavClick}
                        >
                            <div>{isAdmin ? "פאנל ניהול" : "פאנל משתמש"}</div>
                        </NavLink>
                        <NavLink
                            to="/home"
                            className="action"
                            onClick={() => logOut()}
                        >
                            <div>התנתק</div>
                        </NavLink>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AuthMenu;