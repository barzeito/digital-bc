import SignIn from "../../signIn/SignIn";
import Home from "../../home/Home";
import Page404 from "../page404/Page404";
import { Routes, Route, Navigate } from 'react-router-dom';
import CardDisplay from "../../cards/cardDisplay/CardDisplay";
import AdminPanel from "../../adminPanel/adminDash/AdminDash";
import CardList from "../../adminPanel/cardList/CardList";
function Routing(): JSX.Element {
    return (
        <Routes>

            <Route path="/home" element={<Navigate to="/" />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/cards/:company" element={<CardDisplay />} />
            <Route path="/panel/admin/cards" element={<CardList />} />
            <Route path="/panel/admin" element={<AdminPanel />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Page404 />} />

        </Routes>

    );
}

export default Routing;
