"use client";
import { createContext, useContext } from "react";

const AppContext = createContext(null);

export function AppProvider({ data, children }) {
    return (
        <AppContext.Provider value={data}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}
