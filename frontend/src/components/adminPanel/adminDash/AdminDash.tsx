import { useEffect } from "react";
import AdminMenu from "../AdminMenu/AdminMenu";
import "./AdminDash.css";
import { useNavigate } from "react-router-dom";

function AdminPanel(): JSX.Element {
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('dbcToken' || undefined || null)) {
            navigate('/');
        }
    })
    return (
        <div className="AdminDash">
            <AdminMenu />
        </div>
    );
}

export default AdminPanel;
