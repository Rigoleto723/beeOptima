import { useEffect, useState } from 'react';
import axios from 'axios';

const useHive = () => {
    const [hives, setHives] = useState([]);

    const reloadHive = () => {
        axios.get('http://127.0.0.1:8000/api/hives/')
        .then(({ data }) => {
            setHives(data);
        });
        console.log('Datos de la colmena desde reload', hives)
    };

    const fetchHive = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/hives/');
            setHives(response.data);
        } catch (error) {
            console.error('Error fetching Hive:', error);
        }
        console.log('Datos de la colmena desde Fetch', hives)
        };


    const createHive = async (newHive) => {
        console.log('Datos desde createHive', newHive)
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/hives/', newHive);
            setHives((prevHive) => [...prevHive, response.data]);
        } catch (error) {
            console.error('Error creating Hive:', error);
        }
        };

    const deleteHive = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/hives/${id}/`);
            setHives((prevHive) => prevHive.filter((item) => item.id !== id));
        } catch (error) {
            console.error('Failed to delete Hive', error);
        }
        };

    const editHive = async (updatedHive) => {
        try {
            const response = await axios.put(
                `http://127.0.0.1:8000/api/hives/${updatedHive.id}/`,
                updatedHive
            );
            setHives((prevHive) =>
                prevHive.map((item) => (item.id === updatedHive.id ? response.data : item))
            );
        } catch (error) {
            console.error('Error editing Hive:', error);
        }
    };

    useEffect(() => {
        reloadHive();
    }, []);

    return {
        hives,
        reloadHive,
        fetchHive,
        createHive,
        editHive,
        deleteHive,
    };
};

export default useHive;
