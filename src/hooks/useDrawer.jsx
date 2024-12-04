import { createContext, useContext, useState } from "react";

const UseDrawer = createContext();

export const DRAWER_TYPE = {
    edit: 0,
    create: 1
};

export function DrawerProvider({ children }) {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState(null);

    const closeDrawer = () => {
        setOpen(false);
    };

    function openDrawer(type) {
        setOpen(true);
        setType(type);
    }

    const openEditDrawer = () => openDrawer(DRAWER_TYPE.edit);
    const openCreateDrawer = () => openDrawer(DRAWER_TYPE.create);

    return (
        <UseDrawer.Provider
            value={{
                isOpen: open,
                closeDrawer,
                openEditDrawer,
                openCreateDrawer,
                type
            }}
        >
            {children}
        </UseDrawer.Provider>
    );
}

export function useDrawer() {
    const context = useContext(UseDrawer);
    if (!context) throw new Error("Cannot use DrawerProvider without provider");
    return context;
}
