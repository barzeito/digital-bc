import { ReactNode } from "react";
import SideBarMenu from "../../menu/sideBarMenu/SideBarMenu";
import "./DashboardLayout.css";

function DashboardLayout({ children }: { children: ReactNode }): JSX.Element {
    return (
        <div className="DashboardLayout">
            <SideBarMenu />
            <div className="DashboardContent">
                {children}
            </div>
        </div>
    );
}

export default DashboardLayout;
