import "./SideBarMenu.css";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import authService from "../../../services/authService";
import notify from "../../../services/popupMessage";
import useCurrentUser from "../../../utils/useCurrentUser";

function SideBarMenu(): JSX.Element | null {
    const user = useCurrentUser();
    const isAdmin = user?.roleId === 2;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Close sidebar when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const sidebar = document.querySelector('.SidebarMenu');
            const toggle = document.querySelector('.SidebarToggle');

            if (sidebar && toggle &&
                !sidebar.contains(event.target as Node) &&
                !toggle.contains(event.target as Node) &&
                isSidebarOpen) {
                setIsSidebarOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSidebarOpen]);

    // Close sidebar when window is resized to desktop size
    useEffect(() => {
        function handleResize() {
            if (window.innerWidth > 768 && isSidebarOpen) {
                setIsSidebarOpen(false);
            }
        }

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isSidebarOpen]);

    function logOut() {
        authService.logout();
        notify.success('!התנתקת בהצלחה מהמערכת');
    }

    function toggleSidebar() {
        setIsSidebarOpen(!isSidebarOpen);
    }

    function closeSidebar() {
        setIsSidebarOpen(false);
    }

    if (!user) return null;

    return (
        <>
            <button className="SidebarToggle" onClick={toggleSidebar}>
                <i className={isSidebarOpen ? "fas fa-times" : "fas fa-bars"}></i>
            </button>

            {isSidebarOpen && <div className="sidebar-overlay active"></div>}

            <div className={`SidebarMenu ${isSidebarOpen ? 'open' : ''}`}>
                <div>
                    <div className="SideTitle">
                        <div className="companyLogo">
                            <i className="fas fa-id-card-alt"></i>
                            <span>WJS Innovations</span>
                        </div>
                    </div>

                    <div className="MenuSection">
                        <div className="SectionTitle">ניווט</div>
                        {isAdmin ? (
                            <>
                                <NavItem to="/panel/admin" icon="fas fa-home" label="בית" end onClick={closeSidebar} />
                                <NavItem to="/panel/admin/cards" icon="fas fa-address-card" label="כרטיסים" onClick={closeSidebar} />
                                <NavItem to="/panel/admin/users" icon="fas fa-users" label="משתמשים" onClick={closeSidebar} />
                            </>
                        ) : (
                            <NavItem to={`/panel/user/${user.userId}`} icon="fas fa-user" label="הכרטיס שלי" onClick={closeSidebar} />
                        )}
                    </div>

                    <div className="MenuSection">
                        <div className="SectionTitle">כללי</div>
                        <NavItem
                            to="/home"
                            icon="fas fa-sign-out-alt"
                            label="התנתק"
                            onClick={() => {
                                logOut();
                                closeSidebar();
                            }}
                        />
                    </div>
                </div>

                <div className="SidebarFooter">
                    <div className="UserCircle">{user.firstName[0]}{user.lastName[0]}</div>
                    <div className="UserInfo">
                        <div className="UserName">{user.firstName} {user.lastName}</div>
                        <div className="UserEmail">{user.email}</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SideBarMenu;

interface NavItemProps {
    to: string;
    icon: string;
    label: string;
    onClick?: () => void;
    end?: boolean;
}

function NavItem({ to, icon, label, onClick, end }: NavItemProps) {
    return (
        <NavLink to={to} end={end} onClick={onClick} className="NavCard">
            <div className="NavIcon"><i className={icon}></i></div>
            <div className="NavText">{label}</div>
        </NavLink>
    );
}