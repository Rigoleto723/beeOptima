import { IconReportMedical, IconTools, IconBuildingStore, IconBrandProducthunt, IconFileText } from "@tabler/icons-react";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import "./styles.css"


const sidebarList = [
    {
        icon: <IconReportMedical />,
        name: 'Colmenas',
        path: '/app/hives',
    },

    {
        icon: <IconBuildingStore />,
        name: 'Colonias',
        path: '/app/colonies',
    },
    {
        icon: <IconBrandProducthunt />,
        name: 'Produccion Polen',
        path: '/app/pollen-productions',
    },
    {
        icon: <IconBrandProducthunt />,
        name: 'Monitoreo Colonias',
        path: '/app/colony-monitorings',
    },
    {
        icon: <IconTools />,
        name: 'Dashboard',
        path: '/app/dashboard',
    }
];

const MainLayout = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    return (
        <div className="main-layout-container">
            <div className="sidebar bg-gray-800 text-white">
                <div className="logo-container flex items-center justify-center py-4">
                    <img src={logo} alt="Logo" className="logo" />
                </div>
                <ul className="sidebar-list space-y-2">
                    {sidebarList.map((item) => (
                        <li key={item.path} onClick={() => navigate(item.path)} className={`sidebar-item p-2 cursor-pointer hover:bg-gray-700 ${pathname === item.path ? "active" : ""}`}>
                            <div className="flex items-center space-x-2">
                                {item.icon}
                                <span>{item.name}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="content bg-gray-100">
                <Outlet />
            </div>
        </div>
    );
}

export default MainLayout;
