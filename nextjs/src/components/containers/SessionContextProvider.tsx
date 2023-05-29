import axios from 'axios';
import React, { createContext } from 'react';

export interface SessionContext {
    isLoggedIn: boolean;
    destroy(): Promise<boolean>;
}

export const SessionContext = createContext<SessionContext>({ isLoggedIn: false, destroy: async () => false });

export interface SessionContextProviderProps {
    children: React.ReactNode;
}

export const SessionContextProvider: React.FC<SessionContextProviderProps> = ({
    children,
}: SessionContextProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
    React.useLayoutEffect(() => {
        axios
            .get('/api/auth/session', {
                withCredentials: true,
            })
            .then((result) => {
                setIsLoggedIn(result.data.isLoggedIn);
            })
            .catch(() => setIsLoggedIn(false));
    }, []);
    const destroy = React.useCallback(async () => {
        const result = await axios.delete('/api/auth/session', { withCredentials: true });
        if (result.status === 200) {
            setIsLoggedIn(false);
            return true;
        } else {
            alert('destroy session is failed');
            return false;
        }
    }, []);
    return <SessionContext.Provider value={{ isLoggedIn, destroy }}>{children}</SessionContext.Provider>;
};
