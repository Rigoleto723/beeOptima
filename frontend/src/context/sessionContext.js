import React, { createContext, useContext, useState, useEffect } from 'react';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [accessToken, setAccessToken] = useState();

    const setGroups = (groups) => {
        if (user) {
            const updateUser = { ...user, groups };
            setUser(updateUser);
            localStorage.setItem('user', JSON.stringify(updateUser));
        }
    }

    const setUserName = (fullName) => {
        if (user) {
            const [name = "", surname = ""] = fullName.split(" ");
            const updateUser = { ...user, name, surname };
            setUser(updateUser);
            localStorage.setItem('user', JSON.stringify(updateUser));
        }
    }

    useEffect(() => {
        // Cargar datos desde localStorage
        const storedToken = localStorage.getItem("access_token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setAccessToken(storedToken);
                setUser(parsedUser);
            } catch (error) {
                console.error('Error al parsear datos de usuario:', error);
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("user");
            }
        }
    }, []);

    const login = (accessToken, refreshToken, userData) => {
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setAccessToken(accessToken);
        setUser(userData);
    }

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        setAccessToken(null);
        setUser(null);
    }

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    }

    const hasRole = (role) => {
        if (!user || !user.groups) return false;
        return user.groups.some(group => group.name === role);
    }

    return (
        <SessionContext.Provider value={{ user, accessToken, login, logout, setGroups, setUserName, updateUser, hasRole }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);

