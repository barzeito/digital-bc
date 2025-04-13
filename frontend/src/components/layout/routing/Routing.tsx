import SignIn from "../../auth/signIn/SignIn";
import Home from "../../home/Home";
import Page404 from "../page404/Page404";
import { Routes, Route, Navigate } from 'react-router-dom';
import CardDisplay from "../../cards/cardDisplay/CardDisplay";
import CardList from "../../adminPanel/cardList/CardList";
import ChangePassword from "../../auth/changePassword/ChangePassword";
import AdminDash from "../../adminPanel/adminDash/AdminDash";
import AdminRoute from "./ProtectedAdminRout";
import EditCard from "../../adminPanel/editCard/EditCard";
import AddCard from "../../adminPanel/addCard/AddCard";
import UserDash from "../../userPanel/userDash/UserDash";
import UserCardEdit from "../../userPanel/userCardEdit/UserCardEdit";
function Routing(): JSX.Element {

    return (
        <Routes>

            <Route path="/home" element={<Navigate to="/" />} />

            <Route path="/login" element={<SignIn />} />
            <Route path="/settings/change-password/:id" element={<ChangePassword />} />

            <Route path="/cards/:company" element={<CardDisplay />} />

            <Route path="/panel/user/:id" element={<UserDash />} />
            <Route path="/panel/user/edit-card/:userId/:id" element={<UserCardEdit />} />

            <Route path="/panel/admin" element={<AdminRoute element={<AdminDash />} />} />
            <Route path="/panel/admin/cards" element={<AdminRoute element={<CardList />} />} />
            <Route path="/panel/admin/cards/add-card" element={<AdminRoute element={<AddCard />} />} />
            <Route path="/panel/admin/edit/:id" element={<AdminRoute element={<EditCard />} />} />

            <Route path="/" element={<Home />} />
            <Route path="*" element={<Page404 />} />

        </Routes>

    );
}

export default Routing;
