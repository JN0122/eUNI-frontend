import { createContext, useCallback, useContext, useState } from "react";

const DrawerContext = createContext();

export function DrawerProvider({ children }) {
    const [open, setOpen] = useState(false);

    const closeDrawer = useCallback(() => {
        setOpen(false);
    }, []);

    const openDrawer = useCallback(() => {
        setOpen(true);
    }, []);

    return (
        <DrawerContext.Provider
            value={{ isOpen: open, closeDrawer, openDrawer }}
        >
            {children}
        </DrawerContext.Provider>
    );
}

export function useDrawer() {
    const context = useContext(DrawerContext);
    if (!context) throw new Error("Cannot use DrawerProvider without provider");
    return context;
}
