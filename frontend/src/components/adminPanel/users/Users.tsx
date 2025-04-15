import { NavLink } from "react-router-dom";
import userModel from "../../../models/userModel";
import "./Users.css";


interface usersProps {
    user: userModel;
}

const getRoleName = (roleId: number): string => {
    switch (roleId) {
        case 1: return 'משתמש';
        case 2: return 'מנהל';
        default: return 'לא ידוע';
    }
};

function Users(props: usersProps): JSX.Element {
    return (
        <div className="Users">
            <div className="users-header">
                <div className="header-info">
                    <h2 className="user-fullName">{props.user.firstName} {props.user.lastName}</h2>
                </div>

                <div className="users-body">
                    <div className="users-info">
                        <p><strong>אימייל:</strong> {props.user.email}</p>
                        <p><strong>דרגה:</strong> {getRoleName(props.user.roleId ?? 1)}</p>
                        </div>
                </div>

                <div className="users-footer">
                    <NavLink to={`/panel/admin/edit/${props.user.userId}`} className="edit-btn">עריכה</NavLink>
                    <button className="delete-btn" >מחיקה</button>
                </div>
            </div>
        </div>
    );
}

export default Users;
