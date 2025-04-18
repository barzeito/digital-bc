import { NavLink } from "react-router-dom";
import userModel from "../../../models/userModel";
import "./Users.css";
import { useState } from "react";
import authService from "../../../services/authService";
import notify from "../../../services/popupMessage";


interface usersProps {
    user: userModel;
}

function Users(props: usersProps): JSX.Element {
    const userId = props.user.userId;
    const [showDelete, setShowDelete] = useState(false);

    async function deleteUser(): Promise<void> {
        try {
            if (userId) {
                await authService.deleteUser(userId);
                notify.success('ֿֿ!המשתמש נמחק בהצלחה');
            }
        } catch (error) {
            console.log(error)
            notify.error('.אירעה שגיאה בעת מחיקת המשתמש, אנא נסה שוב');
        }
        setShowDelete(false);
    }


    const getRoleName = (roleId: number): string => {
        switch (roleId) {
            case 1: return 'משתמש';
            case 2: return 'מנהל';
            default: return 'לא ידוע';
        }
    };


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
                    <NavLink to={`/panel/admin/edit-user/${props.user.userId}`} className="edit-btn">עריכה</NavLink>
                    <button className="delete-btn" onClick={() => setShowDelete(true)}>מחיקה</button>
                </div>
            </div>
            {showDelete && (
                <div className="PopUpContainer">
                    <div className="DeleteContainer">
                        <div className="Delete-PopUp">
                            <span>מוחק את {props.user.firstName} {props.user.lastName}</span>
                            <p>האם אתה בטוח שברצונך למחוק את {props.user.firstName} {props.user.lastName}?</p>
                            <div className="confirm-btn">
                                <button onClick={deleteUser}>מחיקה</button>
                                <button className="cancel-btn" onClick={() => setShowDelete(false)}>ביטול</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Users;
