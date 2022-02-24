import { useContext, createContext, Dispatch, SetStateAction } from 'react';

interface AppContextInterface {
    isAuthenticated: boolean;
    setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
}

export const AppContext = createContext<AppContextInterface | null>(null);

export function useAppContext() {
    return useContext(AppContext);
}
