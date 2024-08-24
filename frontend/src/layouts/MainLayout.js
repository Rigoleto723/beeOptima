import { IconReportMedical, IconTools, IconBuildingStore, IconBrandProducthunt, IconFileText } from "@tabler/icons-react";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import useAuth from '../hooks/useAuth';
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
        icon: <IconTools />,
        name: 'Dashboard',
        path: '/app/dashboard',
    }
];

const MainLayout = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

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
                    <li key="logout" onClick={() => {
                        logout();  // Llama a la función logout del hook useAuth
                        navigate('/login');  // Redirige a la página de inicio de sesión
                    }} className="sidebar-item p-2 cursor-pointer hover:bg-gray-700">
                        <div className="flex items-center space-x-2">
                            <IconTools />
                            <span>Cerrar Sesión</span>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="content bg-gray-100">
                <Outlet />
            </div>
        </div>
    );
}

export default MainLayout;
