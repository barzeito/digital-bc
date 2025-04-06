import SignIn from "../../auth/signIn/SignIn";
import Home from "../../home/Home";
import Page404 from "../page404/Page404";
import { Routes, Route, Navigate } from 'react-router-dom';
import CardDisplay from "../../cards/cardDisplay/CardDisplay";
import AdminPanel from "../../adminPanel/adminDash/AdminDash";
import CardList from "../../adminPanel/cardList/CardList";
import ChangePassword from "../../auth/changePassword/ChangePassword";
import { useEffect, useState } from "react";
import { authStore } from "../../../redux/authState";
import { jwtDecode } from "jwt-decode";
import authService from "../../../services/authService";
function Routing(): JSX.Element {

    const [user, setUser] = useState<User>();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    type User = {
        firstName: string,
        lastName: string,
        userId: string,
    };


    useEffect(() => {
        const token = authStore.getState().token;
        if (token) {
            const user = jwtDecode<{ user: User }>(token).user;
            setUser(user);
        }

        const unsubscribe = authStore.subscribe(() => {
            const token = authStore.getState().token;
            if (token) {
                const user = jwtDecode<{ user: User }>(token).user;
                setUser(user);
            } else {
                setUser(undefined)
            }
        });

        return unsubscribe;
    }, [])

    useEffect(() => {
        async function ifAdmin() {
            if (user) {
                try {
                    const userAdmin = await authService.isAdmin(user.userId);
                    setIsAdmin(userAdmin);
                } catch (error: any) {
                    return;
                }
            }
        }
        ifAdmin();
    }, [user]);

    return (
        <Routes>

            <Route path="/home" element={<Navigate to="/" />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/change-password/:id" element={<ChangePassword />} />
            <Route path="/cards/:company" element={<CardDisplay />} />
            <Route path="/panel/admin" element={isAdmin ? <AdminPanel /> : <Navigate to="/home" />} />
            <Route path="/panel/admin/cards" element={isAdmin ? <CardList /> : <Navigate to="/home" />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Page404 />} />

        </Routes>

    );
}

export default Routing;
