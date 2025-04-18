import { useEffect, useState } from "react";
import "./UserList.css";
import userModel from "../../../models/userModel";
import Users from "../users/Users";
import authService from "../../../services/authService";
import notify from "../../../services/popupMessage";
import { authStore } from "../../../redux/authState";
import AdminMenu from "../AdminMenu/AdminMenu";

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
            <AdminMenu />
            <div className="DisplayUsers">
                {users.map(u => <Users key={u.userId} user={u} />)}
            </div>
        </div>
    );
}

export default UserList;
