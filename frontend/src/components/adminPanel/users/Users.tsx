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
            case 3: return 'פרימיום'
            default: return 'לא ידוע';
        }
    };


    return (
        <>
            <tr>
                <td>{props.user.firstName} {props.user.lastName}</td>
                <td>{props.user.email}</td>
                <td>{getRoleName(props.user.roleId ?? 1)}</td>
                <td>
                    <NavLink to={`/panel/admin/edit-user/${props.user.userId}`} className="editUser-btn">עריכה</NavLink>
                    <button className="deleteUser-btn" onClick={() => setShowDelete(true)}>מחיקה</button>
                </td>
            </tr>

            {showDelete && (
                <div className="PopUpContainer">
                    <div className="DeleteContainer">
                        <div className="Delete-PopUp">
                            <span>מוחק את {props.user.firstName} {props.user.lastName}</span>
                            <p>האם אתה בטוח שברצונך למחוק את {props.user.firstName} {props.user.lastName}?</p>
                            <div className="users-buttons">
                                <button onClick={deleteUser} className="submit-btn">מחיקה</button>
                                <button className="cancel-btn" onClick={() => setShowDelete(false)}>ביטול</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Users;
