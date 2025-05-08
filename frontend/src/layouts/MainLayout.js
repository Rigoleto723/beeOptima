import { IconReportMedical, IconTools, IconBuildingStore, IconBrandProducthunt, IconFileText, IconLogout } from "@tabler/icons-react";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import "./styles.css"
import client from "../axiosConfig";
import { useSession } from '../context/sessionContext';
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
        name: 'Reportes',
        path: '/app/dashboard',
    }
];

const MainLayout = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { logout } = useSession();

    const handleLogout = () => {
        // Limpiar localStorage y sessionStorage
        localStorage.clear();
        sessionStorage.clear();

        // Limpiar el sessionId del contexto
        logout();

        // Intentar cerrar sesión en el servidor
        client.post('/api/auth/logout/')
            .then(() => {
                console.log('Sesión cerrada exitosamente en el servidor');
            })
            .catch((error) => {
                console.error('Error al cerrar sesión en el servidor:', error);
            })
            .finally(() => {
                // Redireccionar al login con recarga completa
                window.location.href = '/login';
            });
    }

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
                    <li onClick={handleLogout} className="sidebar-item p-2 cursor-pointer hover:bg-gray-700">
                        <div className="flex items-center space-x-2">
                            <IconLogout />
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
