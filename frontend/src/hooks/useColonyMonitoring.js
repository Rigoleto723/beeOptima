import { useEffect, useState } from 'react';
import client from '../axiosConfig';

const useMonitoring = (colonyId) => {
    const [monitoring, setMonitoring] = useState([]);

    const reloadMonitoring = () => {
        // Usar el colonyId en la consulta si está presente
        const url = colonyId 
            ? `/api/colony-monitorings/?colony=${colonyId}` 
            : '/api/colony-monitorings/';
        
            client
                .get(url)
                .then(({ data }) => {
                    setMonitoring(data);
                })
                .catch((error) => {
                    console.error('Error fetching monitoring data in reloadMonitoring:', error);
                });
        console.log('Datos de Monitoreo desde reload', monitoring);
    };

    const fetchMonitoring = async () => {
        try {
            const url = colonyId 
                ? `/api/colony-monitorings/?colony=${colonyId}` 
                : '/api/colony-monitorings/';
                
            const response = await client
                .get(url);
                setMonitoring(response.data);
        } catch (error) {
            console.error('Error fetching ColonyMonitoring:', error);
        }
        console.log('Datos de Monitoreo desde Fetch', monitoring);
    };


    const createMonitoring = async (newMonitoring) => {
        console.log('Datos desde createMonitoring', newMonitoring)
        try {
            const response = await client
                .post('/api/colony-monitorings/', newMonitoring);
                setMonitoring((prevMonitoring) => [...prevMonitoring, response.data]);
        } catch (error) {
            console.error('Error creating ColonyMonitoring:', error);
        }
        };

    const deleteMonitoring = async (id) => {
        try {
            await client
                .delete(`/api/colony-monitorings/${id}/`);
                setMonitoring((prevMonitoring) => prevMonitoring.filter((item) => item.id !== id));
        } catch (error) {
            console.error('Failed to delete ColonyMonitoring', error);
        }
        };

    const editMonitoring = async (updatedMonitoring) => {
        try {
            const response = await client
                .put(
                    `/api/colony-monitorings/${updatedMonitoring.id}/`,
                    updatedMonitoring
                );
                setMonitoring((prevMonitoring) =>
                    prevMonitoring.map((item) => (item.id === updatedMonitoring.id ? response.data : item))
                );
        } catch (error) {
            console.error('Error editing ColonyMonitoring:', error);
        }
    };

    useEffect(() => {
        reloadMonitoring();
    }, [colonyId]);

    return {
        monitoring,
        reloadMonitoring,
        fetchMonitoring,
        createMonitoring,
        editMonitoring,
        deleteMonitoring,
    };
};

export default useMonitoring;
