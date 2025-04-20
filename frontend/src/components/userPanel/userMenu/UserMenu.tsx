import "./UserMenu.css";
import authService from "../../../services/authService";
import notify from "../../../services/popupMessage"
import { NavLink } from "react-router-dom";
import { useCurrentUser } from "../../../utils/useCurrentUser";

function UserMenu(): JSX.Element {

    const user = useCurrentUser();

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
