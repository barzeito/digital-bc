import { NavLink } from "react-router-dom";
import "./Page404.css";

function Page404(): JSX.Element {
    return (
        <div className="Page404" dir="ltr">
            
            <div className="content">
                <h1>404</h1>
                <h2>Page Not Found</h2>
                <p>Oops! The page you are looking for might have been removed or is temporarily unavailable.</p>
                <div className="no-button"><NavLink to="/">Click Here to go back to Home page</NavLink></div>
            </div>
        </div>
    );
}

export default Page404;
