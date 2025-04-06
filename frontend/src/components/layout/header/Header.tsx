import AuthMenu from "../../auth/authMenu/AuthMenu";
import "./Header.css";

function Header(): JSX.Element {
    return (
        <div className="Header">
            <AuthMenu />
        </div>
    );
}

export default Header;
