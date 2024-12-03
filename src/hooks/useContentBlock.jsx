import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState
} from "react";
import { useLocation } from "react-router-dom";
import getSubpagePath from "../helpers/getSubpagePath.js";

const UseContentBlock = createContext();

function getBreadcrumbsStruct(mainPath) {
    return [{ title: mainPath }];
}

export function ContentBlockProvider({ mainPath, items, children }) {
    const [breadcrumbs, setBreadcrumbs] = useState(
        getBreadcrumbsStruct(mainPath)
    );
    const { pathname } = useLocation();

    const activeSubPageKey = useMemo(
        () =>
            items
                .find((item) => item.path === getSubpagePath(pathname))
                ?.key.toString() || "0",
        [items, pathname]
    );

    const addBreadcrumb = useCallback(
        (breadcrumb) => {
            setBreadcrumbs((prev) => [
                ...prev,
                ...getBreadcrumbsStruct(breadcrumb)
            ]);
        },
        [setBreadcrumbs]
    );

    const setBreadcrumbsToDefault = useCallback(() => {
        setBreadcrumbs(getBreadcrumbsStruct(mainPath));
    }, [setBreadcrumbs, mainPath]);

    return (
        <UseContentBlock.Provider
            value={{
                items,
                activeSubPageKey,
                addBreadcrumb,
                setBreadcrumbsToDefault,
                breadcrumbs
            }}
        >
            {children}
        </UseContentBlock.Provider>
    );
}

export const useContentBlock = () => {
    const context = useContext(UseContentBlock);
    if (!context) {
        throw new Error("Cannot use sub page without provider");
    }
    return context;
};
