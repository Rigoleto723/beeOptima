import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import MainLayout from "./layouts/MainLayout";
import Hives from './pages/Hives';
import Colonies from './pages/Colonies';
import ColonyMonitoring from './pages/ColonyMonitoring';
import Dashboard from './pages/Dashboard';
import { useSession } from "./context/sessionContext";

function App() {
    const { accessToken, user } = useSession();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (accessToken && user) {
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, [accessToken, user]);

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Cargando...</div>;
    }

    if (!accessToken || !user) {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        );
    }

    return (
        <Routes>
            <Route path="/app" element={<MainLayout />} >
                <Route path="hives" element={<Hives />} />
                <Route path="colonies" element={<Colonies />} />
                <Route path="/app/colony-monitorings/:colonyId" element={<ColonyMonitoring />} />
                <Route path="dashboard" element={<Dashboard />} />
            </Route>
            <Route path="*" element={<Navigate to="/app/hives" />} />
        </Routes>
    );
}

export default App;
