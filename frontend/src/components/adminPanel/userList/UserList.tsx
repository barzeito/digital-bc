import { useEffect, useState } from "react";
import "./UserList.css";
import userModel from "../../../models/userModel";
import Users from "../users/Users";
import authService from "../../../services/authService";
import notify from "../../../services/popupMessage";
import { authStore } from "../../../redux/authState";
import DashboardLayout from "../dashboardLayout/DashboardLayout";
import { NavLink } from "react-router-dom";

function UserList(): JSX.Element {

    const [users, setUsers] = useState<userModel[]>([]);

    useEffect(() => {
        authService.getAllUsers()
            .then(usersFromServer => setUsers(usersFromServer))
            .catch(error => notify.error(error));

        const unsubscribe = authStore.subscribe(() => {
            setUsers([...authStore.getState().userData])
        })
        return unsubscribe;
    }, []);

    return (
        <div className="UserList">
            <DashboardLayout>
                <div >
                    <h2>ניהול משתמשים</h2>
                    <p>ניהול משתמשים וגישות</p>
                </div>
                <div className="cards-options">
                    <NavLink to="/panel/admin/users/add-user" className="newCard-btn">
                        <div className="newCard-icon"><i className="fa-solid fa-plus"></i></div>
                        <div className="newCard-text">יצירת משתמש חדש</div>
                    </NavLink>
                </div>
                <div className="DisplayUsers">
                    <div className="table-container">

                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>שם מלא</th>
                                    <th>אימייל</th>
                                    <th>דרגה</th>
                                    <th>פעולות</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => <Users key={u.userId} user={u} />)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </DashboardLayout>
        </div>
    );
}

export default UserList;
