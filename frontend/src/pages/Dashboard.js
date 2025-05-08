import { IconTools } from '@tabler/icons-react';
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar } from 'recharts';
import RouteLayout from '../layouts/RouteLayout';
import client from '../axiosConfig';


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
    // Formatear fecha y hora del último reporte
    const lastReportDate = latestMonitoring ? new Date(latestMonitoring.datetime).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : '--';

    return (
        <RouteLayout title="Dashboard" icon={<IconTools />} headerItem={null}>
            <div className="p-6 space-y-6">
                {/* Selector de Colonia */}
                <div className="mb-6">
                    <select
                        className="w-full p-2 rounded-lg bg-orange-200/80 text-orange-900 font-bold border border-orange-400"
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
                    <div className="bg-orange-300/80 p-4 rounded-lg border border-orange-400 shadow-lg flex flex-col items-center">
                        <span className="text-orange-900 font-bold">Temp. Colonia</span>
                        <span className="text-2xl text-orange-900 font-bold">{latestMonitoring ? latestMonitoring.colony_temperature + '°C' : '--'}</span>
                        <span className="text-xs text-orange-800 mt-1">{lastReportDate}</span>
                    </div>
                    <div className="bg-orange-300/80 p-4 rounded-lg border border-orange-400 shadow-lg flex flex-col items-center">
                        <span className="text-orange-900 font-bold">Temp. Ambiente</span>
                        <span className="text-2xl text-orange-900 font-bold">{latestMonitoring ? latestMonitoring.ambient_temperature + '°C' : '--'}</span>
                        <span className="text-xs text-orange-800 mt-1">{lastReportDate}</span>
                    </div>
                    <div className="bg-orange-300/80 p-4 rounded-lg border border-orange-400 shadow-lg flex flex-col items-center">
                        <span className="text-orange-900 font-bold">Humedad Colonia</span>
                        <span className="text-2xl text-orange-900 font-bold">{latestMonitoring ? latestMonitoring.colony_humidity + '%' : '--'}</span>
                        <span className="text-xs text-orange-800 mt-1">{lastReportDate}</span>
                    </div>
                    <div className="bg-orange-300/80 p-4 rounded-lg border border-orange-400 shadow-lg flex flex-col items-center">
                        <span className="text-orange-900 font-bold">Humedad Ambiente</span>
                        <span className="text-2xl text-orange-900 font-bold">{latestMonitoring ? latestMonitoring.ambient_humidity + '%' : '--'}</span>
                        <span className="text-xs text-orange-800 mt-1">{lastReportDate}</span>
                    </div>
                    <div className="bg-orange-300/80 p-4 rounded-lg border border-orange-400 shadow-lg flex flex-col items-center">
                        <span className="text-orange-900 font-bold">Peso</span>
                        <span className="text-2xl text-orange-900 font-bold">{latestMonitoring ? latestMonitoring.weight + ' kg' : '--'}</span>
                        <span className="text-xs text-orange-800 mt-1">{lastReportDate}</span>
                    </div>
                    <div className="bg-orange-300/80 p-4 rounded-lg border border-orange-400 shadow-lg flex flex-col items-center">
                        <span className="text-orange-900 font-bold">Estado de Salud</span>
                        <span className="text-2xl text-orange-900 font-bold">{latestStatus ? latestStatus.colony_health : '--'}</span>
                        <span className="text-xs text-orange-800 mt-1">{latestStatus ? new Date(latestStatus.datetime).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : '--'}</span>
                    </div>
                </div>

                {/* Gráfico de evolución del peso */}
                <div className="mt-8">
                    <div className="bg-orange-300/80 p-4 rounded-lg border border-orange-400 shadow-lg">
                        <span className="text-orange-900 font-bold">Evolución del Peso</span>
                        <div className="h-72 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monitoringData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#FDE68A" />
                                    <XAxis dataKey="datetime" stroke="#FB923C" tickFormatter={d => new Date(d).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} />
                                    <YAxis stroke="#FB923C" />
                                    <Tooltip contentStyle={{ backgroundColor: '#FFF7ED', border: '1px solid #FDBA74', borderRadius: '0.5rem', color: '#EA580C' }} labelStyle={{ color: '#FB923C' }} />
                                    <Legend />
                                    <Line type="monotone" dataKey="weight" stroke="#F59E0B" name="Peso (kg)" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Gráficos de temperatura y humedad */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Temperatura */}
                    <div className="bg-orange-300/80 p-4 rounded-lg border border-orange-400 shadow-lg">
                        <span className="text-orange-900 font-bold">Temperatura (Colonia vs Ambiente)</span>
                        <div className="h-72 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monitoringData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#FDE68A" />
                                    <XAxis dataKey="datetime" stroke="#FB923C" tickFormatter={d => new Date(d).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} />
                                    <YAxis stroke="#FB923C" />
                                    <Tooltip contentStyle={{ backgroundColor: '#FFF7ED', border: '1px solid #FDBA74', borderRadius: '0.5rem', color: '#EA580C' }} labelStyle={{ color: '#FB923C' }} />
                                    <Legend />
                                    <Line type="monotone" dataKey="colony_temperature" stroke="#FB923C" name="Temp. Colonia (°C)" />
                                    <Line type="monotone" dataKey="ambient_temperature" stroke="#F472B6" name="Temp. Ambiente (°C)" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    {/* Humedad */}
                    <div className="bg-orange-300/80 p-4 rounded-lg border border-orange-400 shadow-lg">
                        <span className="text-orange-900 font-bold">Humedad (Colonia vs Ambiente)</span>
                        <div className="h-72 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monitoringData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#FDE68A" />
                                    <XAxis dataKey="datetime" stroke="#FB923C" tickFormatter={d => new Date(d).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} />
                                    <YAxis stroke="#FB923C" />
                                    <Tooltip contentStyle={{ backgroundColor: '#FFF7ED', border: '1px solid #FDBA74', borderRadius: '0.5rem', color: '#EA580C' }} labelStyle={{ color: '#FB923C' }} />
                                    <Legend />
                                    <Line type="monotone" dataKey="colony_humidity" stroke="#10B981" name="Humedad Colonia (%)" />
                                    <Line type="monotone" dataKey="ambient_humidity" stroke="#F59E42" name="Humedad Ambiente (%)" />
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