import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import MainLayout from "./layouts/MainLayout";
import Hives from './pages/Hives';
import Colonies from './pages/Colonies';
import ColonyMonitoring from './pages/ColonyMonitoring';
import Dashboard from './pages/Dashboard';
import client from "./axiosConfig";
import { useSession } from "./context/sessionContext";

function App() {
    const [currentUser, setCurrentUser] = useState(false);
    const { sessionId, setGroups, setUserName } = useSession();

    useEffect(() => {
        console.log('here');
        client.get("/api/auth/user/", { withCredentials: true })
            .then((response) => {
                setGroups(response.data.user.groups.map(group => group.name));
                setUserName(`${response.data.user.name ?? ''} ${response.data.user.surname ?? ''}`);
                setCurrentUser(true);
            })
            .catch((error) => {
                console.log('error', error);
                setCurrentUser(false);
            });
    }, [sessionId]);

    return (
        <Router>
            <Routes>
                {/* {currentUser ? (
                    <> */}
                        <Route path="/app" element={<MainLayout />} >
                            <Route path="hives" element={<Hives />} />
                            <Route path="colonies" element={<Colonies />} />
                            <Route path="/app/colony-monitorings/:colonyId" element={<ColonyMonitoring />} />
                            <Route path="dashboard" element={<Dashboard />} />
                        </Route>
                        <Route path="*" element={<Navigate to="/app/hives" />} />
                    {/* </>
                ) : (
                    <> */}
                        <Route path="/" element={<Login />} />
                        <Route path="*" element={<Navigate to="/" />} />
                 {/*    </>
                )} */}
            </Routes>
        </Router>
    );
}

export default App;
