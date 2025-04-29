import "./SideBarMenu.css";
import { NavLink } from "react-router-dom";
import authService from "../../../services/authService";
import notify from "../../../services/popupMessage";
import useCurrentUser from "../../../utils/useCurrentUser";

function SideBarMenu(): JSX.Element | null {
    const user = useCurrentUser();
    const isAdmin = user?.roleId === 2;

    function logOut() {
        authService.logout();
        notify.success('!התנתקת בהצלחה מהמערכת');
    }

    if (!user) return null;

    return (
        <div className="SidebarMenu">
            <div>
                <div className="SideTitle">
                    <div className="companyLogo">
                        <i className="fas fa-id-card-alt"></i>
                        <span>CardConnect</span>
                    </div>
                </div>

                <div className="MenuSection">
                    <div className="SectionTitle">ניווט</div>
                    {isAdmin ? (
                        <>
                            <NavItem to="/panel/admin" icon="fas fa-home" label="בית" end/>
                            <NavItem to="/panel/admin/cards" icon="fas fa-address-card" label="כרטיסים" />
                            <NavItem to="/panel/admin/users" icon="fas fa-users" label="משתמשים" />
                        </>
                    ) : (
                        <NavItem to={`/panel/user/${user.userId}`} icon="fas fa-user" label="הכרטיס שלי" />
                    )}
                </div>

                <div className="MenuSection">
                    <div className="SectionTitle">כללי</div>
                    <NavItem to="/home" icon="fas fa-sign-out-alt" label="התנתק" onClick={logOut} />
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