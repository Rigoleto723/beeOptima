import { IconPencil, IconPlus, IconTrash, IconBuildingStore, IconRotateClockwise } from '@tabler/icons-react';
import React, { useState, useEffect } from 'react';
import ConfirmationModal from '../components/ConfirmationModal';
import GeneralModal from '../components/GeneralModal';
import RouteLayout from '../layouts/RouteLayout';
import useHive from '../hooks/useHive';


const HeaderBtn = ({ onClick }) => (
    <div className='h-full flex flex-row items-center pr-4'>
        <button className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold shadow-md hover:brightness-110 hover:scale-105 transition-all duration-200" onClick={onClick}><IconBuildingStore />Añadir Nueva Colmena</button>
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
        <div className="h-full">
            <RouteLayout title='Lista de Colmenas' icon={<IconBuildingStore />} headerItem={<HeaderBtn onClick={() => setShowModalCreatedHive(true)} />}>
                <div className="overflow-x-auto">
                    <table className="min-w-full rounded-xl shadow-lg bg-orange-300/80 border border-orange-400">
                        <thead>
                            <tr className="bg-gradient-to-r from-orange-400 via-orange-300 to-orange-200 text-orange-900 uppercase text-sm">
                                <th className="px-4 py-3 text-left">Nombre Colmena</th>
                                <th className="px-4 py-3 text-left">Localización</th>
                                <th className="px-4 py-3 text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hives.map(item => (
                                <tr key={item.id} className="even:bg-orange-50 hover:bg-orange-100 transition-colors">
                                    <td className="px-4 py-3 text-gray-900 font-medium">{item.name}</td>
                                    <td className="px-4 py-3 text-gray-900">{item.location && item.location.length > 0 ? item.location : <span className='text-gray-400'>Sin Información</span>}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button onClick={() => {
                                                setShowModalUpdateHive(true);
                                                setId(item.id);
                                                setName(item.name);
                                                setLocation(item.location);
                                            }} className="p-2 rounded-lg bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white shadow transition-transform hover:scale-105" title="Editar">
                                                <IconPencil size={18} />
                                            </button>
                                            <button className="p-2 rounded-lg bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 text-white shadow transition-transform hover:scale-105" onClick={() => openDeleteModal(item.id, item.name)} title="Eliminar">
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