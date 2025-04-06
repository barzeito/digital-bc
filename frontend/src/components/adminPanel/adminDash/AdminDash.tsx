import AdminMenu from "../AdminMenu/AdminMenu";
import "./AdminDash.css";

function AdminPanel(): JSX.Element {

    return (
        <div className="AdminDash">
            <AdminMenu />
        </div>
    );
}

export default AdminPanel;
