import { createContext, useContext, useMemo } from "react";
import { useLocation } from "react-router-dom";
import getSubpagePath from "../helpers/getSubpagePath.js";

const MainMenuContext = createContext();

export function MainMenuProvider({ items, children }) {
    const { pathname } = useLocation();

    const activePageKey = useMemo(
        () =>
            items
                .find((item) => item.path === getSubpagePath(pathname))
                ?.key?.toString() || "0",
        [items, pathname],
    );

    return (
        <MainMenuContext.Provider
            value={{
                items,
                activePageKey,
            }}
        >
            {children}
        </MainMenuContext.Provider>
    );
}

export const useMainMenu = () => {
    const context = useContext(MainMenuContext);
    if (!context) {
        throw new Error("Cannot use MainMenu context without provider");
    }
    return context;
};
