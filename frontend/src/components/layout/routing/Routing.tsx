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
import UserList from "../../adminPanel/userList/UserList";
import EditUser from "../../adminPanel/editUser/EditUser";
import AppointmentsForm from "../../userPanel/appointmentsForm/AppointmentsForm";
import UserRoute from "./ProtectedUserRou";
import AppointmentList from "../../userPanel/appointmentsList/AppointmentsList";
import PremiumRoute from "./ProtectedPremiumRoute";
import Loader from "../loader/Loader";
import ForgotPassword from "../../auth/forgotPassword/ForgotPassword";
import ResetPassword from "../../auth/resetPassword /ResetPassword";
import AddUser from "../../adminPanel/addUser/AddUser";
function Routing(): JSX.Element {

    return (
        <Routes>

            <Route path="/home" element={<Navigate to="/" />} />

            <Route path="/login" element={<SignIn />} />
            <Route path="/settings/change-password/:id" element={<ChangePassword />} />
            <Route path="/settings/forgot-password" element={<ForgotPassword />} />
            <Route path="/settings/reset-password" element={<ResetPassword />} />

            <Route path="/cards/:company" element={<CardDisplay />} />

            <Route path="/load" element={<Loader />} />


            <Route path="/panel/user/:id" element={<UserRoute element={<UserDash />} />} />
            <Route path="/panel/user/edit-card/:ownedBy/:id" element={<UserRoute element={<EditCard />} />} />
            <Route path="/panel/user/appointments/edit/:userId/:id" element={<PremiumRoute element={<AppointmentsForm />} />} />
            <Route path="/panel/user/appointments/list/:userId/:id" element={<PremiumRoute element={<AppointmentList />} />} />

            <Route path="/panel/admin" element={<AdminRoute element={<AdminDash />} />} />
            <Route path="/panel/admin/cards" element={<AdminRoute element={<CardList />} />} />
            <Route path="/panel/admin/cards/add-card" element={<AdminRoute element={<AddCard />} />} />
            <Route path="/panel/admin/edit/:id" element={<AdminRoute element={<EditCard />} />} />

            <Route path="/panel/admin/users" element={<AdminRoute element={<UserList />} />} />
            <Route path="/panel/admin/users/add-user" element={<AdminRoute element={<AddUser />} />} />
            <Route path="/panel/admin/edit-user/:id" element={<AdminRoute element={<EditUser />} />} />


            <Route path="/" element={<Home />} />
            <Route path="*" element={<Page404 />} />

        </Routes>

    );
}

export default Routing;
