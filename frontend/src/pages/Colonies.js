import { IconPencil, IconPlus, IconTrash, IconBuildingStore, IconRotateClockwise } from '@tabler/icons-react';
import React, { useState, useEffect } from 'react';
import './styles.css';
import ConfirmationModal from '../components/ConfirmationModal';
import GeneralModal from '../components/GeneralModal';
import RouteLayout from '../layouts/RouteLayout';
import useColony from '../hooks/useColony';
import useHive from '../hooks/useHive';


const HeaderBtn = ({ onClick }) => (
    <div className='h-full flex flex-row items-center pr-4'>
        <button className='add-button' onClick={onClick}><IconBuildingStore />Añadir Nueva Colonia</button>
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
    const [queenPresent, setQueenPresent] = useState(true);

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
        setColonyHealth('')
        setNumOfBees('');
        setQueenPresent('');
        reloadColony();
    };

    return (
    <div>
        <RouteLayout title='Lista de Colonias' icon={<IconBuildingStore />} headerItem={<HeaderBtn onClick={() => setShowModalCreateColony(true)} />}>
            <table className="equipment-table">
                <thead>
                <tr>
                    <th>Colmena</th>
                    <th>Numero Colonia</th>
                    <th>Salud Colonia</th>
                    <th>Numero de Abejas</th>
                    <th>Reina Presente</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                    {colony.map(item => (
                        <tr key={item.id}>
                            <td className="type-column">
                                <span className="type-text">{item.hive}</span>
                            </td>
                            <td className="type-column">
                                <span className="type-text">{item.colony_number}</span>
                            </td>
                            <td className="type-column">
                                {item.colony_health && item.colony_health.length > 0 ? (
                                        <span className="type-text">{item.colony_health}</span>
                                ) : (
                                        <span className="type-text">Sin Información</span>
                                )}
                            </td>
                            <td className="type-column">
                                {item.num_of_bees ? (
                                    <span className="type-text">{item.num_of_bees}</span>
                                ) : (
                                    <span className="type-text">Sin Información</span>
                                )}
                            </td>
                            <td className="type-column">
                                {item.queen_present !== null ? (
                                    <span className="type-text">{item.queen_present ? 'Sí' : 'No'}</span>
                                ) : (
                                    <span className="type-text">Sin Información</span>
                                )}
                            </td>
                            <td className="type-column">
                                    <div className="type-action-buttons">
                                        <button onClick={() => {
                                            setShowModalUpdateColony(true); 
                                            setId(item.id);
                                            setHive(item.hive) 
                                            setColonyNumber(item.colony_number); 
                                            setColonyHealth(item.colony_health);
                                            setNumOfBees(item.num_of_bees);
                                            setQueenPresent(item.queen_present);
                                            }} className="edit-button" >
                                            <IconPencil />
                                        </button>
                                        <button className="delete-button" onClick={() => openDeleteModal(item.id, item.colony_number)}>
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
                    <input 
                        type="text" 
                        value={colonyHealth} 
                        onChange={(e) => setColonyHealth(e.currentTarget.value)}
                    />
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
                    <label>Numero de la Colonia</label>
                    <input 
                        type="text" 
                        value={colonyNumber} 
                        onChange={(e) => setColonyNumber(e.currentTarget.value)}
                    />
                </div>
                <div>
                    <label>Salud de la Colonia</label>
                    <input 
                        type="text" 
                        value={colonyHealth} 
                        onChange={(e) => setColonyHealth(e.currentTarget.value)}
                    />
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