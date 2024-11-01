import { createContext, useContext } from "react";

const SubPageContext = createContext();

export function SubPageProvider({ setBreadcrumbs, children }) {
    return (
        <SubPageContext.Provider
            value={{
                setBreadcrumbs,
            }}
        >
            {children}
        </SubPageContext.Provider>
    );
}

export const useSubPage = () => useContext(SubPageContext);
