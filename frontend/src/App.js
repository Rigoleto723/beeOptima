import logo from './logo.svg';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from "./layouts/MainLayout";
import Hives from './pages/Hives';
import Colonies from './pages/Colonies';
import PollenProduction from './pages/PollenProduction';
import ColonyMonitoring from './pages/ColonyMonitoring';
import Dashboard from './pages/Dashboard';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/app" element={<MainLayout />}>
            <Route path="hives" element={<Hives />} />
            <Route path="colonies" element={<Colonies />} />
            <Route path="pollen-productions" element={<PollenProduction />} />
            <Route path="colony-monitorings" element={<ColonyMonitoring />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}


export default App;
