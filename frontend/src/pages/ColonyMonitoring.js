import { IconPencil, IconPlus, IconTrash, IconBuildingStore, IconRotateClockwise } from '@tabler/icons-react';
import React, { useState, useEffect } from 'react';
import { utils, writeFile } from 'xlsx';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './styles.css';
import ConfirmationModal from '../components/ConfirmationModal';
import GeneralModal from '../components/GeneralModal';
import RouteLayout from '../layouts/RouteLayout';
import useColony from '../hooks/useColony';
import useMonitoring from '../hooks/useColonyMonitoring';
import client from "../axiosConfig";



const HeaderBtn = ({ onCreate, onDownload }) => (
    <div className='header-buttons-container'>
        <button className='add-button' onClick={onCreate}><IconBuildingStore />Añadir Nuevo Registro</button>
        <button className='add-button' onClick={onDownload}><IconBuildingStore />Descargar Reporte</button>
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
        client.get(`/api/colony-status/${colonyId}/latest/`)
            .then(response => {
                setColonyStatus(response.data);
                console("Estado de la colinia : ", colonyStatus)
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
    <div>
        <RouteLayout title='Lista de Colonias' icon={<IconBuildingStore />} headerItem={<HeaderBtn onCreate={() => setShowModalCreateMonitoring(true)} onDownload={handleDownloadReport} />}>
            <h3>Colmena:</h3><label>{colonyStatus ? colonyStatus.colony_name : 'Datos no disponibles'}</label>
            <h3>Colonia:</h3><label>{colonyStatus ? colonyStatus.colony : 'Datos no disponibles'}</label>
            <h3>Estado de Salud:</h3><label>{colonyStatus ? colonyStatus.colony_health : 'Datos no disponibles'}</label>
            <h3>Numero de Abejas:</h3><label>{colonyStatus ? colonyStatus.num_of_bees : 'Datos no disponibles'}</label>
            <h3>Reina Presente:</h3><label>{colonyStatus ? (colonyStatus.queen_present ? 'Sí' : 'No') : 'Datos no disponibles'}</label>
            
            <table className="equipment-table">
                <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Colonia</th>
                    <th>Temperatura de la Colonia</th>
                    <th>Humedad de la Colonia</th>
                    <th>Temperatura Ambiente</th>
                    <th>Humedad Ambiente</th>
                    <th>Peso</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                    {monitoring.map(item => (
                        <tr key={item.id}>
                            <td className="type-column">
                                <span className="type-text">{item.datetime}</span>
                            </td>
                            <td className="type-column">
                                <span className="type-text">{item.colony}</span>
                            </td>
                            <td className="type-column">
                                {item.colony_temperature ? (
                                    <span className="type-text">{item.colony_temperature}</span>
                                ) : (
                                    <span className="type-text">Sin Información</span>
                                )}
                            </td>
                            <td className="type-column">
                                {item.colony_humidity ? (
                                    <span className="type-text">{item.colony_humidity}</span>
                                ) : (
                                    <span className="type-text">Sin Información</span>
                                )}
                            </td>
                            <td className="type-column">
                                {item.ambient_temperature ? (
                                    <span className="type-text">{item.ambient_temperature}</span>
                                ) : (
                                    <span className="type-text">Sin Información</span>
                                )}
                            </td>
                            <td className="type-column">
                                {item.ambient_humidity ? (
                                    <span className="type-text">{item.ambient_humidity}</span>
                                ) : (
                                    <span className="type-text">Sin Información</span>
                                )}
                            </td>
                            <td className="type-column">
                                {item.weight ? (
                                    <span className="type-text">{item.weight}</span>
                                ) : (
                                    <span className="type-text">Sin Información</span>
                                )}
                            </td>
                            <td className="type-column">
                                    <div className="type-action-buttons">
                                        <button onClick={() => {
                                            setShowModalUpdateMonitoring(true); 
                                            setId(item.id);
                                            setDate(item.datetime);
                                            setColonyTemperature(item.colony_temperature);
                                            setColonyHumidity(item.colony_humidity);
                                            setAmbientTemperature(item.ambient_temperature);
                                            setAmbientHumidity(item.ambient_humidity);
                                            setWeight(item.weight);
                                            }} className="edit-button" >
                                            <IconPencil />
                                        </button>
                                        <button className="delete-button" onClick={() => {
                                            setId(item.id);
                                            setShowModalDeleted(true);
                                            
                                            }}>
                                            <IconTrash />
                                        </button>
                                    </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
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