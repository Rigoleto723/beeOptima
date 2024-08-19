import { IconPencil, IconPlus, IconTrash, IconBuildingStore, IconRotateClockwise } from '@tabler/icons-react';
import React, { useState, useEffect } from 'react';
import './styles.css';
import ConfirmationModal from '../components/ConfirmationModal';
import GeneralModal from '../components/GeneralModal';
import RouteLayout from '../layouts/RouteLayout';
import useHive from '../hooks/useHive';


const HeaderBtn = ({ onClick }) => (
    <div className='h-full flex flex-row items-center pr-4'>
        <button className='add-button' onClick={onClick}><IconBuildingStore />Añadir Nueva Colmena</button>
    </div>
)

function Hives() {

    const { hives, createHive, deleteHive, editHive, reloadHive } = useHive();
    const [showModalDeleted, setShowModalDeleted] = useState(false);
    const [showModalCreatedHive, setShowModalCreatedHive] = useState(false);
    const [ShowModalUpdateHive, setShowModalUpdateHive] = useState(false);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');

    const openDeleteModal = (id, name) => {
        setId(id);
        setName(name);
        setShowModalDeleted(true);
        console.log(`Eliminando el elemento con id: ${id} y nombre: ${name}`);
    };

    const handleDelete = async () => {
        if (id !== null) {
            await deleteHive(id);
        };
        setShowModalDeleted(false);
        setId('');
        setName('');
        reloadHive();
    };

    const handleCreateHive = async () => {
        console.log("Creating Hive:", name);
        await createHive({
            name: name,
            location: location,
        });
        setShowModalCreatedHive(false);
        setName('');
        setLocation('');
        reloadHive();
    };

    const handleUpdateHive = async () => {
        console.log("Update Hive:", name);
        await editHive({
            id: id,
            name: name,
            location: location,
        });
        setShowModalUpdateHive(false);
        setId('');
        setName('');
        setLocation('');
        reloadHive();
    };

    return (
    <div>
        <RouteLayout title='Lista de Colmenas' icon={<IconBuildingStore />} headerItem={<HeaderBtn onClick={() => setShowModalCreatedHive(true)} />}>
            <table className="equipment-table">
                <thead>
                <tr>
                    <th>Nombre Colmena</th>
                    <th>Localización</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                    {hives.map(item => (
                        <tr key={item.id}>
                            <td className="type-column">
                                <span className="type-text">{item.name}</span>
                            </td>
                            <td className="type-column">
                                {item.location && item.location.length > 0 ? (
                                        <span className="type-text">{item.location}</span>
                                ) : (
                                        <span className="type-text">Sin Información</span>
                                )}
                            </td>
                            <td className="type-column">
                                    <div className="type-action-buttons">
                                        <button onClick={() => {
                                            setShowModalUpdateHive(true); 
                                            setId(item.id); 
                                            setName(item.name); 
                                            setLocation(item.location); 
                                            }} className="edit-button" >
                                            <IconPencil />
                                        </button>
                                        <button className="delete-button" onClick={() => openDeleteModal(item.id, item.name)}>
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
            isOpen={showModalCreatedHive}
            onClose={() => setShowModalCreatedHive(false)}
            title="Crear Colmena"
            footerActions={
                <button
                    type="button"
                    onClick={handleCreateHive}
                >
                Crear
                </button>}
        >
                <div>
                    <label>Nombre de la Colmena</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.currentTarget.value)}
                    />
                </div>
                <div>
                    <label>Localización</label>
                    <input 
                        type="text" 
                        value={location} 
                        onChange={(e) => setLocation(e.currentTarget.value)}
                    />
                </div>
        </GeneralModal>
        <GeneralModal
            isOpen={ShowModalUpdateHive}
            onClose={() => setShowModalUpdateHive(false)}
            title="Editar Colmena"
            footerActions={
                <button
                    type="button"
                    onClick={handleUpdateHive}
                >
                Actualizar
                </button>}
        >
                <div>
                    <label>Nombre de la Colmena</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.currentTarget.value)}
                    />
                </div>
                <div>
                    <label>Localización</label>
                    <input 
                        type="text" 
                        value={location} 
                        onChange={(e) => setLocation(e.currentTarget.value)}
                    />
                </div>
        </GeneralModal>
        <ConfirmationModal
            show={showModalDeleted}
            onClose={() => setShowModalDeleted(false)}
            onConfirm={handleDelete}
            title="Confirmar Eliminación"
            body={`¿Está seguro que desea eliminar el elemento "${name}"?`}
        />
    </div>
    );
}

export default Hives;