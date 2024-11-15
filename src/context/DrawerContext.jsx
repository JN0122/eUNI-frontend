import { createContext, useContext, useState } from "react";

const DrawerContext = createContext();

export const DRAWER_TYPE = {
    update: 0,
    edit: 1
};

export function DrawerProvider({ children }) {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState(null);
    const [data, setData] = useState(null);

    const closeDrawer = () => {
        setOpen(false);
        setType(null);
    };

    function openDrawer(type) {
        setOpen(true);
        setType(type);
    }

    const openEditDrawer = () => openDrawer(DRAWER_TYPE.edit);
    const openUpdateDrawer = () => openEditDrawer(DRAWER_TYPE.update);

    return (
        <DrawerContext.Provider
            value={{
                isOpen: open,
                closeDrawer,
                openEditDrawer,
                openUpdateDrawer,
                data,
                setData,
                type
            }}
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
