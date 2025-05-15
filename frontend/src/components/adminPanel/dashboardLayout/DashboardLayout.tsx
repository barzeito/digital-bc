import { ReactNode } from "react";
import SideBarMenu from "../../menu/sideBarMenu/SideBarMenu";
import "./DashboardLayout.css";
import Footer from "../../layout/footer/Footer";

function DashboardLayout({ children }: { children: ReactNode }): JSX.Element {
    return (
        <div className="DashboardLayout">
            <SideBarMenu />
            <div className="DashboardContent">
                {children}
                <footer>
                    <Footer />
                </footer>
            </div>
        </div>
    );
}

export default DashboardLayout;
