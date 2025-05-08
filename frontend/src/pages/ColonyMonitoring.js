import { IconPencil, IconPlus, IconTrash, IconBuildingStore, IconRotateClockwise } from '@tabler/icons-react';
import React, { useState, useEffect } from 'react';
import { utils, writeFile } from 'xlsx';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ConfirmationModal from '../components/ConfirmationModal';
import GeneralModal from '../components/GeneralModal';
import RouteLayout from '../layouts/RouteLayout';
import useColony from '../hooks/useColony';
import useMonitoring from '../hooks/useColonyMonitoring';
import client from "../axiosConfig";



const HeaderBtn = ({ onCreate, onDownload }) => (
    <div className='h-full flex flex-row items-center pr-4 gap-4'>
        <button className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold shadow-md hover:brightness-110 hover:scale-105 transition-all duration-200" onClick={onCreate}><IconBuildingStore />Añadir Nuevo Registro</button>
        <button className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold shadow-md hover:brightness-110 hover:scale-105 transition-all duration-200" onClick={onDownload}><IconBuildingStore />Descargar Reporte</button>
    </div>
)

function ColonyMonitoring() {

    const { colonyId } = useParams();
    const { monitoring, createMonitoring, deleteMonitoring, editMonitoring, reloadMonitoring } = useMonitoring(colonyId);
    const { colony } = useColony();
    const [showModalDeleted, setShowModalDeleted] = useState(false);
    const [showModalCreatedMonitoring, setShowModalCreateMonitoring] = useState(false);
    const [ShowModalUpdateMonitoring, setShowModalUpdateMonitoring] = useState(false);
    const [id, setId] = useState('');
    const [date, setDate] = useState(new Date());
    const [colonyNumber, setColonyNumber] = useState('');
    const [colonyTemperature, setColonyTemperature] = useState('');
    const [colonyHumidity, setColonyHumidity] = useState('');
    const [ambientTemperature, setAmbientTemperature] = useState('');
    const [ambientHumidity, setAmbientHumidity] = useState('');
    const [weight, setWeight] = useState('');
    const [colonyStatus, setColonyStatus] = useState(null);

    useEffect(() => {
        client.get(`/api/colonies/${colonyId}/`)
            .then(response => {
                const colonyData = response.data;
                // Obtener el último estado de la colonia
                if (colonyData.status_history && colonyData.status_history.length > 0) {
                    const latestStatus = colonyData.status_history[0]; // El primer elemento es el más reciente
                    setColonyStatus({
                        colony_name: colonyData.hive_name,
                        colony: colonyData.colony_number,
                        colony_health: latestStatus.colony_health,
                        num_of_bees: latestStatus.num_of_bees,
                        queen_present: latestStatus.queen_present
                    });
                }
            })
            .catch(error => {
                console.error("Error fetching colony status", error);
            });
    }, [colonyId]);

    // Función para manejar la descarga de datos
    const handleDownloadReport = () => {
        // Estructura de los datos que deseas descargar
        const data = monitoring.map(item => ({
            Fecha: item.datetime,
            Colonia: item.colony,
            'Temperatura de la Colonia': item.colony_temperature || 'Sin Información',
            'Humedad de la Colonia': item.colony_humidity || 'Sin Información',
            'Temperatura Ambiente': item.ambient_temperature || 'Sin Información',
            'Humedad Ambiente': item.ambient_humidity || 'Sin Información',
            Peso: item.weight || 'Sin Información'
        }));

        // Crear hoja de trabajo
        const worksheet = utils.json_to_sheet(data);

        // Crear libro de trabajo
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, 'Monitoreo de Colonias');

        // Guardar el archivo Excel
        writeFile(workbook, 'ReporteMonitoreoColonias.xlsx');
    };
    const openDeleteModal = () => {
        console.log(`el id antes de setear el id de eliminacion es: ${id}`);

        setShowModalDeleted(true);
        console.log(`Eliminando el monitoreo con id: ${id}`);
    };

    const handleDelete = async () => {
        if (id !== null) {
            await deleteMonitoring(id);
        };
        setShowModalDeleted(false);
        setId('');
        setColonyNumber('');
        setColonyTemperature('');
        setColonyHumidity('');
        setAmbientTemperature('');
        setAmbientHumidity('');
        setWeight('');
        reloadMonitoring();
    };

    const handleCreateMonitoring = async () => {
        console.log("Creating Colony:", colonyNumber);
        await createMonitoring({
            colony: colonyId,
            datetime: date,
            colony_temperature: colonyTemperature,
            colony_humidity: colonyHumidity,
            ambient_temperature: ambientTemperature,
            ambient_humidity: ambientHumidity,
            weight: weight,
        });
        setShowModalCreateMonitoring(false);
        setId('');
        setColonyNumber('');

        setColonyTemperature('');
        setColonyHumidity('');
        setAmbientTemperature('');
        setAmbientHumidity('');
        setWeight('');
        reloadMonitoring();
    };

    const handleUpdateMonitoring = async () => {
        console.log("Update Colony:", colonyNumber);
        await editMonitoring({
            id: id,
            colony: colonyNumber,
            datetime: date,
            colony_temperature: colonyTemperature,
            colony_humidity: colonyHumidity,
            ambient_temperature: ambientTemperature,
            ambient_humidity: ambientHumidity,
            weight: weight,
        });
        setShowModalUpdateMonitoring(false);
        setId('');
        setColonyNumber('');

        setColonyTemperature('');
        setColonyHumidity('');
        setAmbientTemperature('');
        setAmbientHumidity('');
        setWeight('');
        reloadMonitoring();
    };

    return (
        <div className="h-full">
            <RouteLayout title='Monitoreo de Colonias' icon={<IconBuildingStore />} headerItem={<HeaderBtn onCreate={() => setShowModalCreateMonitoring(true)} onDownload={handleDownloadReport} />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-orange-300/80 backdrop-blur-lg rounded-xl shadow-lg border border-orange-400 mb-8">
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <h3 className="text-sm font-medium text-orange-500 mb-1">Colmena:</h3>
                            <label className="text-lg font-semibold text-orange-900">
                                {colonyStatus ? colonyStatus.colony_name : 'Datos no disponibles'}
                            </label>
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-sm font-medium text-orange-500 mb-1">Colonia:</h3>
                            <label className="text-lg font-semibold text-orange-900">
                                {colonyStatus ? colonyStatus.colony : 'Datos no disponibles'}
                            </label>
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-sm font-medium text-orange-500 mb-1">Estado de Salud:</h3>
                            <label className={`text-lg font-semibold ${colonyStatus ?
                                colonyStatus.colony_health === "Saludable" ? 'text-green-500' :
                                    colonyStatus.colony_health === "Débil" ? 'text-yellow-600' :
                                        'text-red-500'
                                : 'text-gray-400'
                                }`}>
                                {colonyStatus ? colonyStatus.colony_health : 'Datos no disponibles'}
                            </label>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <h3 className="text-sm font-medium text-orange-500 mb-1">Número de Abejas:</h3>
                            <label className="text-lg font-semibold text-orange-900">
                                {colonyStatus ? colonyStatus.num_of_bees.toLocaleString() : 'Datos no disponibles'}
                            </label>
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-sm font-medium text-orange-500 mb-1">Reina Presente:</h3>
                            <label className={`text-lg font-semibold ${colonyStatus ?
                                colonyStatus.queen_present ? 'text-green-500' : 'text-red-500'
                                : 'text-gray-400'
                                }`}>
                                {colonyStatus ? (colonyStatus.queen_present ? 'Sí' : 'No') : 'Datos no disponibles'}
                            </label>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full rounded-xl shadow-lg bg-orange-300/80 border border-orange-400">
                        <thead>
                            <tr className="bg-gradient-to-r from-orange-400 via-orange-300 to-orange-200 text-orange-900 uppercase text-sm">
                                <th className="px-4 py-3 text-left">Fecha</th>
                                <th className="px-4 py-3 text-left">Colonia</th>
                                <th className="px-4 py-3 text-left">Temperatura de la Colonia</th>
                                <th className="px-4 py-3 text-left">Humedad de la Colonia</th>
                                <th className="px-4 py-3 text-left">Temperatura Ambiente</th>
                                <th className="px-4 py-3 text-left">Humedad Ambiente</th>
                                <th className="px-4 py-3 text-left">Peso</th>
                                <th className="px-4 py-3 text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {monitoring.map(item => (
                                <tr key={item.id} className="even:bg-orange-50 hover:bg-orange-100 transition-colors">
                                    <td className="px-4 py-3 text-gray-900">{item.datetime}</td>
                                    <td className="px-4 py-3 text-gray-900">{item.colony}</td>
                                    <td className="px-4 py-3 text-gray-900">{item.colony_temperature ? item.colony_temperature : <span className="text-gray-400">Sin Información</span>}</td>
                                    <td className="px-4 py-3 text-gray-900">{item.colony_humidity ? item.colony_humidity : <span className="text-gray-400">Sin Información</span>}</td>
                                    <td className="px-4 py-3 text-gray-900">{item.ambient_temperature ? item.ambient_temperature : <span className="text-gray-400">Sin Información</span>}</td>
                                    <td className="px-4 py-3 text-gray-900">{item.ambient_humidity ? item.ambient_humidity : <span className="text-gray-400">Sin Información</span>}</td>
                                    <td className="px-4 py-3 text-gray-900">{item.weight ? item.weight : <span className="text-gray-400">Sin Información</span>}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button onClick={() => {
                                                setShowModalUpdateMonitoring(true);
                                                setId(item.id);
                                                setDate(item.datetime);
                                                setColonyTemperature(item.colony_temperature);
                                                setColonyHumidity(item.colony_humidity);
                                                setAmbientTemperature(item.ambient_temperature);
                                                setAmbientHumidity(item.ambient_humidity);
                                                setWeight(item.weight);
                                            }} className="p-2 rounded-lg bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white shadow transition-transform hover:scale-105" title="Editar">
                                                <IconPencil size={18} />
                                            </button>
                                            <button className="p-2 rounded-lg bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 text-white shadow transition-transform hover:scale-105" onClick={() => {
                                                setId(item.id);
                                                setShowModalDeleted(true);
                                            }} title="Eliminar">
                                                <IconTrash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </RouteLayout>
            <GeneralModal
                isOpen={showModalCreatedMonitoring}
                onClose={() => setShowModalCreateMonitoring(false)}
                title="Crear Registro"
                footerActions={
                    <button
                        type="button"
                        onClick={handleCreateMonitoring}
                    >
                        Crear
                    </button>}
            >
                <div>
                    <label>ID de la Colonia</label>
                    <input
                        value={colonyId}
                    >
                    </input>

                </div>
                <div>
                    <label>Fecha</label>
                    <DatePicker
                        selected={date}
                        onChange={(date) => setDate(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="Hora"
                        dateFormat="MMMM d, yyyy h:mm aa"
                    />

                </div>
                <div>
                    <label>Temperatura de la Colonia</label>
                    <input
                        type="text"
                        value={colonyTemperature}
                        onChange={(e) => setColonyTemperature(e.currentTarget.value)}
                    />
                </div>
                <div>
                    <label>Humedad de la Colonia</label>
                    <input
                        type="text"
                        value={colonyHumidity}
                        onChange={(e) => setColonyHumidity(e.currentTarget.value)}
                    />
                </div>
                <div>
                    <label>Temperatura Ambiente</label>
                    <input
                        type="text"
                        value={ambientTemperature}
                        onChange={(e) => setAmbientTemperature(e.currentTarget.value)}
                    />
                </div>
                <div>
                    <label>Humedad Ambiente</label>
                    <input
                        type="text"
                        value={ambientHumidity}
                        onChange={(e) => setAmbientHumidity(e.currentTarget.value)}
                    />
                </div>
                <div>
                    <label>Peso</label>
                    <input
                        type="text"
                        value={weight}
                        onChange={(e) => setWeight(e.currentTarget.value)}
                    />
                </div>
            </GeneralModal>
            <GeneralModal
                isOpen={ShowModalUpdateMonitoring}
                onClose={() => setShowModalUpdateMonitoring(false)}
                title="Editar Registro"
                footerActions={
                    <button
                        type="button"
                        onClick={handleUpdateMonitoring}
                    >
                        Actualizar
                    </button>}
            >
                <div>
                    <label>ID de la Colonia</label>
                    <input
                        value={colonyId}
                        onChange={(e) => {
                            setColonyNumber(e.target.value);
                        }}
                    >
                    </input>

                </div>
                <div>
                    <label>Fecha</label>
                    <DatePicker
                        selected={date}
                        onChange={(date) => setDate(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="Hora"
                        dateFormat="MMMM d, yyyy h:mm aa"
                    />

                </div>
                <div>
                    <label>Temperatura de la Colonia</label>
                    <input
                        type="text"
                        value={colonyTemperature}
                        onChange={(e) => setColonyTemperature(e.currentTarget.value)}
                    />
                </div>
                <div>
                    <label>Humedad de la Colonia</label>
                    <input
                        type="text"
                        value={colonyHumidity}
                        onChange={(e) => setColonyHumidity(e.currentTarget.value)}
                    />
                </div>
                <div>
                    <label>Temperatura Ambiente</label>
                    <input
                        type="text"
                        value={ambientTemperature}
                        onChange={(e) => setAmbientTemperature(e.currentTarget.value)}
                    />
                </div>
                <div>
                    <label>Humedad Ambiente</label>
                    <input
                        type="text"
                        value={ambientHumidity}
                        onChange={(e) => setAmbientHumidity(e.currentTarget.value)}
                    />
                </div>
                <div>
                    <label>Peso</label>
                    <input
                        type="text"
                        value={weight}
                        onChange={(e) => setWeight(e.currentTarget.value)}
                    />
                </div>
            </GeneralModal>
            <ConfirmationModal
                show={showModalDeleted}
                onClose={() => setShowModalDeleted(false)}
                onConfirm={handleDelete}
                title="Confirmar Eliminación"
                body={`¿Está seguro que desea eliminar el monitoreo con ID "${id}"?`}
            />
        </div>
    );
}

export default ColonyMonitoring;