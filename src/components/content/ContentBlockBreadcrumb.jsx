import { useContentBlock } from "../../hooks/useContentBlock.jsx";
import { useEffect } from "react";

export default function ContentBlockBreadcrumb({ currentPath, children }) {
    const { addBreadcrumb, setBreadcrumbsToDefault } = useContentBlock();

    useEffect(() => {
        addBreadcrumb(currentPath);
        return () => setBreadcrumbsToDefault();
    }, [addBreadcrumb, currentPath, setBreadcrumbsToDefault]);

    return <>{children}</>;
}
