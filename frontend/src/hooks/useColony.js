import { useEffect, useState } from 'react';
import axios from 'axios';

const useColony = () => {
    const [colony, setColony] = useState([]);

    const reloadColony = () => {
        axios.get('http://127.0.0.1:8000/api/colonies/')
        .then(({ data }) => {
            setColony(data);
        });
        console.log('Datos de la colmena desde reload', colony)
    };

    const fetchColony = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/colonies/');
            setColony(response.data);
        } catch (error) {
            console.error('Error fetching Colony:', error);
        }
        console.log('Datos de la colmena desde Fetch', colony)
        };


    const createColony = async (newColony) => {
        console.log('Datos desde createHive', newColony)
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/colonies/', newColony);
            setColony((prevColony) => [...prevColony, response.data]);
        } catch (error) {
            console.error('Error creating Colony:', error);
        }
        };

    const deleteColony = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/colonies/${id}/`);
            setColony((prevColony) => prevColony.filter((item) => item.id !== id));
        } catch (error) {
            console.error('Failed to delete Colony', error);
        }
        };

    const editColony = async (updatedColony) => {
        try {
            const response = await axios.put(
                `http://127.0.0.1:8000/api/colonies/${updatedColony.id}/`,
                updatedColony
            );
            setColony((prevColony) =>
                prevColony.map((item) => (item.id === updatedColony.id ? response.data : item))
            );
        } catch (error) {
            console.error('Error editing Colony:', error);
        }
    };

    useEffect(() => {
        reloadColony();
    }, []);

    return {
        colony,
        reloadColony,
        fetchColony,
        createColony,
        editColony,
        deleteColony,
    };
};

export default useColony;
