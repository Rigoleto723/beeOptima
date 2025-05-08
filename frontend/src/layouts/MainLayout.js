import { IconReportMedical, IconTools, IconBuildingStore, IconBrandProducthunt, IconFileText, IconLogout } from "@tabler/icons-react";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
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
        <div className="main-layout-container min-h-screen flex bg-gradient-to-br from-orange-300 via-orange-400 to-yellow-200">
            <div className="sidebar w-64 bg-gradient-to-b from-orange-400 via-orange-300 to-yellow-200 border-orange-400 text-white shadow-xl min-h-screen flex flex-col">
                <div className="logo-container flex items-center justify-center py-6">
                    <img src={logo} alt="Logo" className="w-24 h-auto rounded-xl shadow-md border-2 border-orange-400 mb-8 mx-auto" />
                </div>
                <ul className="sidebar-list space-y-2 px-2 text-orange-800 font-bold">
                    {sidebarList.map((item) => (
                        <li key={item.path} onClick={() => navigate(item.path)} className={`sidebar-item p-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 
                            ${pathname === item.path ? "bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-400 font-bold scale-105 text-orange-900 shadow-md" : "hover:bg-orange-500 hover:text-orange-600 hover:shadow"}`}>
                            {item.icon}
                            <span>{item.name}</span>
                        </li>
                    ))}
                    <li onClick={handleLogout} className="sidebar-item p-3 rounded-lg cursor-pointer hover:bg-orange-500 hover:text-orange-600 hover:shadow transition-all flex items-center gap-2">
                        <IconLogout />
                        <span>Cerrar Sesión</span>
                    </li>
                </ul>
            </div>
            <div className="content flex-1 bg-gradient-to-br from-orange-100 via-orange-200 to-yellow-100 p-6 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
}

export default MainLayout;
