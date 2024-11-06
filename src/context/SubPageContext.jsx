import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import { useLocation } from "react-router-dom";
import getSubpagePath from "../helpers/getSubpagePath.js";

const SubPageContext = createContext();

function getBreadcrumbsStruct(mainPath) {
    return [{ title: mainPath }];
}

export function SubPageProvider({ mainPath, items, children }) {
    const [breadcrumbs, setBreadcrumbs] = useState(
        getBreadcrumbsStruct(mainPath),
    );
    const { pathname } = useLocation();

    const activeSubPageKey = useMemo(
        () =>
            items
                .find((item) => item.path === getSubpagePath(pathname))
                .key.toString(),
        [items, pathname],
    );

    const addBreadcrumb = useCallback(
        (breadcrumb) => {
            setBreadcrumbs((prev) => [
                ...prev,
                ...getBreadcrumbsStruct(breadcrumb),
            ]);
        },
        [setBreadcrumbs],
    );

    const setBreadcrumbsToDefault = useCallback(() => {
        setBreadcrumbs(getBreadcrumbsStruct(mainPath));
    }, [setBreadcrumbs, mainPath]);

    return (
        <SubPageContext.Provider
            value={{
                items,
                activeSubPageKey,
                addBreadcrumb,
                setBreadcrumbsToDefault,
                breadcrumbs,
            }}
        >
            {children}
        </SubPageContext.Provider>
    );
}

export const useSubPage = () => {
    const context = useContext(SubPageContext);
    if (!context) {
        throw new Error("Cannot use sub page without provider");
    }
    return context;
};
