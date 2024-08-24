import React, { createContext, useContext, useState } from 'react';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
    const [sessionId, setSessionId] = useState();
    const [userName, setUserName] = useState();
    const [groups, setGroups] = useState();

    return (
        <SessionContext.Provider value={{ sessionId, setSessionId, groups, setGroups, userName, setUserName }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);

