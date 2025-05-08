import { IconPencil, IconPlus, IconTrash, IconBuildingStore, IconEye, IconRotateClockwise } from '@tabler/icons-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal';
import GeneralModal from '../components/GeneralModal';
import RouteLayout from '../layouts/RouteLayout';
import useColony from '../hooks/useColony';
import useHive from '../hooks/useHive';


const HeaderBtn = ({ onClick }) => (
    <div className='h-full flex flex-row items-center pr-4'>
        <button className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold shadow-md hover:brightness-110 hover:scale-105 transition-all duration-200" onClick={onClick}><IconBuildingStore />Añadir Nueva Colonia</button>
    </div>
)

function Colonies() {

    const { colony, createColony, deleteColony, editColony, reloadColony } = useColony();
    const { hives } = useHive();
    const [showModalDeleted, setShowModalDeleted] = useState(false);
    const [showModalCreatedColony, setShowModalCreateColony] = useState(false);
    const [ShowModalUpdateColony, setShowModalUpdateColony] = useState(false);
    const [id, setId] = useState('');
    const [hive, setHive] = useState('')
    const [colonyNumber, setColonyNumber] = useState('');
    const [colonyHealth, setColonyHealth] = useState('');
    const [numOfBees, setNumOfBees] = useState('');
    const [queenPresent, setQueenPresent] = useState('');
    const navigate = useNavigate();

    const handleViewDetails = (colonyId) => {
        navigate(`/app/colony-monitorings/${colonyId}`);
    };

    const openDeleteModal = (id, colonyNumber) => {
        setId(id);
        setColonyNumber(colonyNumber);
        setShowModalDeleted(true);
        console.log(`Eliminando el elemento con id: ${id} y nombre: ${colonyNumber}`);
    };

    const handleDelete = async () => {
        if (id !== null) {
            await deleteColony(id);
        };
        setShowModalDeleted(false);
        setId('');
        setColonyNumber('');
        setColonyHealth('')
        setNumOfBees('');
        setQueenPresent('');
        reloadColony();
    };

    const handleCreateColony = async () => {
        console.log("Creating Colony:", colonyNumber);
        await createColony({
            hive: hive,
            colony_number: colonyNumber,
            colony_health: colonyHealth,
            num_of_bees: numOfBees,
            queen_present: queenPresent,
        });
        setShowModalCreateColony(false);
        setColonyNumber('');
        setColonyHealth('')
        setNumOfBees('');
        setQueenPresent('');
        reloadColony();
    };

    const handleUpdateColony = async () => {
        console.log("Update Colony:", colonyNumber);
        await editColony({
            id: id,
            hive: hive,
            colony_number: colonyNumber,
            colony_health: colonyHealth,
            num_of_bees: numOfBees,
            queen_present: queenPresent,
        });
        setShowModalUpdateColony(false);
        setId('');
        setColonyNumber('');
        setColonyHealth('');
        setNumOfBees('');
        setQueenPresent('');
        reloadColony();
    };

    return (
        <div className="h-full">
            <RouteLayout title='Lista de Colonias' icon={<IconBuildingStore />} headerItem={<HeaderBtn onClick={() => setShowModalCreateColony(true)} />}>
                <div className="overflow-x-auto">
                    <table className="min-w-full rounded-xl shadow-lg bg-orange-300/80 border border-orange-400">
                        <thead>
                            <tr className="bg-gradient-to-r from-orange-400 via-orange-300 to-orange-200 text-orange-900 uppercase text-sm">
                                <th className="px-4 py-3 text-left">Colmena</th>
                                <th className="px-4 py-3 text-left">Numero Colonia</th>
                                <th className="px-4 py-3 text-left">Salud Colonia</th>
                                <th className="px-4 py-3 text-left">Numero de Abejas</th>
                                <th className="px-4 py-3 text-left">Reina Presente</th>
                                <th className="px-4 py-3 text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {colony.map(item => {
                                const lastStatus = item.status_history[item.status_history.length - 1];
                                let healthText = 'text-gray-700';
                                if (lastStatus) {
                                    if (lastStatus.colony_health === 'Saludable') healthText = 'text-green-700';
                                    else if (lastStatus.colony_health === 'Débil') healthText = 'text-yellow-800';
                                    else if (lastStatus.colony_health === 'Muerta') healthText = 'text-red-700';
                                }
                                return (
                                    <tr key={item.id} className="even:bg-orange-50 hover:bg-orange-100 transition-colors">
                                        <td className="px-4 py-3 text-gray-900 font-medium">{item.hive_name}</td>
                                        <td className="px-4 py-3 text-gray-900">{item.colony_number}</td>
                                        {item.status_history.length > 0 ? (
                                            <>
                                                <td className={`px-4 py-3 font-semibold text-center ${healthText}`}>{lastStatus.colony_health}</td>
                                                <td className="px-4 py-3 text-gray-900">{lastStatus.num_of_bees}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`font-semibold ${lastStatus.queen_present ? 'text-green-600' : 'text-red-600'}`}>{lastStatus.queen_present ? 'Sí' : 'No'}</span>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-4 py-3 text-gray-400">Sin Información</td>
                                                <td className="px-4 py-3 text-gray-400">Sin Información</td>
                                                <td className="px-4 py-3 text-gray-400">Sin Información</td>
                                            </>
                                        )}
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button onClick={() => handleViewDetails(item.id)} className="p-2 rounded-lg bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white shadow transition-transform hover:scale-105" title="Ver Detalles">
                                                    <IconEye size={18} />
                                                </button>
                                                <button onClick={() => {
                                                    setShowModalUpdateColony(true);
                                                    setId(item.id);
                                                    setHive(item.hive)
                                                    setColonyNumber(item.colony_number);
                                                    setColonyHealth(item.colony_health);
                                                    setNumOfBees(item.num_of_bees);
                                                    setQueenPresent(item.queen_present);
                                                }} className="p-2 rounded-lg bg-gradient-to-r from-violet-400 to-pink-400 hover:from-violet-500 hover:to-pink-500 text-white shadow transition-transform hover:scale-105" title="Editar">
                                                    <IconPencil size={18} />
                                                </button>
                                                <button className="p-2 rounded-lg bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 text-white shadow transition-transform hover:scale-105" onClick={() => openDeleteModal(item.id, item.colony_number)} title="Eliminar">
                                                    <IconTrash size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </RouteLayout>
            <GeneralModal
                isOpen={showModalCreatedColony}
                onClose={() => setShowModalCreateColony(false)}
                title="Crear Colonia"
                footerActions={
                    <button
                        type="button"
                        onClick={handleCreateColony}
                    >
                        Crear
                    </button>}
            >
                <div>
                    <label>Nombre de la Colmena</label>
                    <select
                        value={hive}
                        onChange={(e) => {
                            setHive(e.target.value);
                        }}
                    >
                        <option value="">Seleccione una opción</option>
                        {hives
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map(b => (
                                <option key={b.id} value={b.id}>
                                    {b.name}
                                </option>
                            ))}
                    </select>

                </div>
                <div>
                    <label>Numero de la Colonia</label>
                    <input
                        type="text"
                        value={colonyNumber}
                        onChange={(e) => setColonyNumber(e.currentTarget.value)}
                    />
                </div>
                <div>
                    <label>Salud de la Colonia</label>
                    <select value={colonyHealth} onChange={(e) => setColonyHealth(e.currentTarget.value)}>
                        <option value="">Seleccione una opción</option>
                        <option value="Saludable">Saludable</option>
                        <option value="Débil">Débil</option>
                        <option value="Muerta">Muerta</option>
                    </select>
                </div>
                <div>
                    <label>Numero de Abejas</label>
                    <input
                        type="text"
                        value={numOfBees}
                        onChange={(e) => setNumOfBees(e.currentTarget.value)}
                    />
                </div>
                <div>
                    <label>Reina Presente</label>
                    <select
                        value={queenPresent}
                        onChange={(e) => setQueenPresent(e.currentTarget.value === "true")}
                    >
                        <option value="">Seleccione una opción</option>
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                    </select>
                </div>
            </GeneralModal>
            <GeneralModal
                isOpen={ShowModalUpdateColony}
                onClose={() => setShowModalUpdateColony(false)}
                title="Editar Colmena"
                footerActions={
                    <button
                        type="button"
                        onClick={handleUpdateColony}
                    >
                        Actualizar
                    </button>}
            >
                <div>
                    <label>Nombre de la Colmena</label>
                    <select
                        value={hive}
                        onChange={(e) => {
                            setHive(e.target.value);
                        }}
                    >
                        <option value="">Seleccione una opción</option>
                        {hives
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map(b => (
                                <option key={b.id} value={b.id}>
                                    {b.name}
                                </option>
                            ))}
                    </select>

                </div>
                <div>
                    <label>Numero de la Colonia</label>
                    <input
                        type="text"
                        value={colonyNumber}
                        onChange={(e) => setColonyNumber(e.currentTarget.value)}
                    />
                </div>
                <div>
                    <label>Salud de la Colonia</label>
                    <select value={colonyHealth} onChange={(e) => setColonyHealth(e.currentTarget.value)}>
                        <option value="">Seleccione una opción</option>
                        <option value="Saludable">Saludable</option>
                        <option value="Débil">Débil</option>
                        <option value="Muerta">Muerta</option>
                    </select>
                </div>
                <div>
                    <label>Numero de Abejas</label>
                    <input
                        type="text"
                        value={numOfBees}
                        onChange={(e) => setNumOfBees(e.currentTarget.value)}
                    />
                </div>
                <div>
                    <label>Reina Presente</label>
                    <select
                        value={queenPresent}
                        onChange={(e) => setQueenPresent(e.currentTarget.value === "true")}
                    >
                        <option value="">Seleccione una opción</option>
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                    </select>
                </div>
            </GeneralModal>
            <ConfirmationModal
                show={showModalDeleted}
                onClose={() => setShowModalDeleted(false)}
                onConfirm={handleDelete}
                title="Confirmar Eliminación"
                body={`¿Está seguro que desea eliminar el elemento "${colonyHealth}"?`}
            />
        </div>
    );
}

export default Colonies;