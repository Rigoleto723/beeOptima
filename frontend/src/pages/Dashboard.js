import { IconBuildingStore, IconTemperature, IconDroplet, IconScale, IconChartBar } from '@tabler/icons-react';
import React, { useState, useEffect } from 'react';
import { Card, Title, Text, Tab, TabList, TabGroup, TabPanel, TabPanels, Grid, Col, Metric, AreaChart, BarChart } from '@tremor/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar } from 'recharts';
import './styles.css';
import RouteLayout from '../layouts/RouteLayout';
import client from '../axiosConfig';

const HeaderBtn = ({ onClick }) => (
    <div className='h-full flex flex-row items-center pr-4'>
        <button className='add-button' onClick={onClick}><IconBuildingStore />Generar Reporte</button>
    </div>
)

function Dashboard() {
    const [colonies, setColonies] = useState([]);
    const [selectedColony, setSelectedColony] = useState(null);
    const [monitoringData, setMonitoringData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchColonies();
    }, []);

    useEffect(() => {
        if (selectedColony !== null && selectedColony !== undefined && selectedColony !== '') {
            fetchMonitoringData(selectedColony);
        }
    }, [selectedColony]);

    const fetchColonies = async () => {
        try {
            setLoading(true);
            const response = await client.get('/api/colonies/');
            setColonies(response.data);
            if (response.data.length > 0) {
                setSelectedColony(String(response.data[0].id));
            }
        } catch (error) {
            console.error('Error fetching colonies:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMonitoringData = async (colonyId) => {
        try {
            setLoading(true);
            const response = await client.get(`/api/colony-monitorings/?colony=${colonyId}`);
            setMonitoringData(response.data);
        } catch (error) {
            console.error('Error fetching monitoring data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Obtener la colonia seleccionada
    const selectedColonyObj = colonies.find(c => String(c.id) === String(selectedColony));
    // Obtener el último registro de monitoreo
    const latestMonitoring = monitoringData.length > 0 ? monitoringData[monitoringData.length - 1] : null;
    // Obtener el último estado de salud
    const latestStatus = selectedColonyObj && selectedColonyObj.status_history && selectedColonyObj.status_history.length > 0
        ? selectedColonyObj.status_history[selectedColonyObj.status_history.length - 1]
        : null;

    return (
        <RouteLayout title="Dashboard" icon={null} headerItem={null}>
            <div className="p-6 space-y-6">
                {/* Selector de Colonia */}
                <div className="mb-6">
                    <select
                        className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700"
                        value={selectedColony || ''}
                        onChange={e => setSelectedColony(String(e.target.value))}
                    >
                        {colonies.map(colony => (
                            <option key={colony.id} value={colony.id}>
                                {colony.hive_name} - Colonia {colony.colony_number}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Métricas Principales */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex flex-col items-center">
                        <span className="text-gray-400">Temperatura</span>
                        <span className="text-2xl text-white font-bold">{latestMonitoring ? latestMonitoring.colony_temperature + '°C' : '--'}</span>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex flex-col items-center">
                        <span className="text-gray-400">Humedad</span>
                        <span className="text-2xl text-white font-bold">{latestMonitoring ? latestMonitoring.colony_humidity + '%' : '--'}</span>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex flex-col items-center">
                        <span className="text-gray-400">Peso</span>
                        <span className="text-2xl text-white font-bold">{latestMonitoring ? latestMonitoring.weight + ' kg' : '--'}</span>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex flex-col items-center">
                        <span className="text-gray-400">Estado de Salud</span>
                        <span className="text-2xl text-white font-bold">{latestStatus ? latestStatus.colony_health : '--'}</span>
                    </div>
                </div>

                {/* Gráficos */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Temperatura y Humedad */}
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 col-span-2">
                        <span className="text-white font-bold">Temperatura y Humedad</span>
                        <div className="h-72 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monitoringData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="datetime" stroke="#9CA3AF" tickFormatter={d => new Date(d).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} />
                                    <YAxis stroke="#9CA3AF" />
                                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem' }} labelStyle={{ color: '#9CA3AF' }} />
                                    <Legend />
                                    <Line type="monotone" dataKey="colony_temperature" stroke="#3B82F6" name="Temperatura (°C)" />
                                    <Line type="monotone" dataKey="colony_humidity" stroke="#10B981" name="Humedad (%)" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    {/* Peso */}
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <span className="text-white font-bold">Evolución del Peso</span>
                        <div className="h-72 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monitoringData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="datetime" stroke="#9CA3AF" tickFormatter={d => new Date(d).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} />
                                    <YAxis stroke="#9CA3AF" />
                                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem' }} labelStyle={{ color: '#9CA3AF' }} />
                                    <Legend />
                                    <Line type="monotone" dataKey="weight" stroke="#F59E0B" name="Peso (kg)" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </RouteLayout>
    );
}

export default Dashboard;