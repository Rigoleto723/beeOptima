import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem('access_token');
    });

    useEffect(() => {
        console.log('isAuthenticated ha cambiado:', isAuthenticated);
    }, [isAuthenticated]);

    const login = async (username, password) => {
        try {
            const response = await axiosInstance.post('/token/', {
                username,
                password,
            });
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            setIsAuthenticated(true);
            console.log('Token guardado:', localStorage.getItem('access_token'));
            console.log('Login exitoso:', response.data);
            console.log('isAuthenticated después de setIsAuthenticated(true):', isAuthenticated); 
            return response.data;
        } catch (error) {
            console.error('Error during login:', error);
            setIsAuthenticated(false);
            return null;
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsAuthenticated(false);
    };
    

    return {
        isAuthenticated,
        login,
        logout,
    };
};

export default useAuth;
