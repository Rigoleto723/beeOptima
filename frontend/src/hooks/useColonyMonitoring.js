import { useEffect, useState } from 'react';
import axios from 'axios';

const useMonitoring = () => {
    const [monitoring, setMonitoring] = useState([]);

    const reloadMonitoring = () => {
        axios.get('http://127.0.0.1:8000/api/colony-monitorings/')
        .then(({ data }) => {
            setMonitoring(data);
        });
        console.log('Datos de Monitoreo desde reload', monitoring)
    };

    const fetchMonitoring = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/colony-monitorings/');
            setMonitoring(response.data);
        } catch (error) {
            console.error('Error fetching ColonyMonitoring:', error);
        }
        console.log('Datos de Monitoreo desde Fetch', monitoring)
        };


    const createMonitoring = async (newMonitoring) => {
        console.log('Datos desde createMonitoring', newMonitoring)
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/colony-monitorings/', newMonitoring);
            setMonitoring((prevMonitoring) => [...prevMonitoring, response.data]);
        } catch (error) {
            console.error('Error creating ColonyMonitoring:', error);
        }
        };

    const deleteMonitoring = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/colony-monitorings/${id}/`);
            setMonitoring((prevMonitoring) => prevMonitoring.filter((item) => item.id !== id));
        } catch (error) {
            console.error('Failed to delete ColonyMonitoring', error);
        }
        };

    const editMonitoring = async (updatedMonitoring) => {
        try {
            const response = await axios.put(
                `http://127.0.0.1:8000/api/colony-monitorings/${updatedMonitoring.id}/`,
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
    }, []);

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
