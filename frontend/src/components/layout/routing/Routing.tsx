import SignIn from "../../signIn/SignIn";
import Home from "../home/Home";
import Page404 from "../page404/Page404";
import { Routes, Route, Navigate } from 'react-router-dom';
function Routing(): JSX.Element {
    return (
        <Routes>

            <Route path="/home" element={<Navigate to="/" />} />
            <Route path="/login" element={<SignIn />} />

            <Route path="/" element={<Home />} />
            <Route path="*" element={<Page404 />} />

        </Routes>

    );
}

export default Routing;
