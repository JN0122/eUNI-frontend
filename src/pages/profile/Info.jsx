import { useTranslation } from "react-i18next";
import { useSubPage } from "../../context/SubPageContext.jsx";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

function Info() {
    const { t } = useTranslation();
    const { setBreadcrumbs } = useSubPage();
    const { userInfo } = useAuth();

    useEffect(() => {
        setBreadcrumbs([{ title: t("basic-info") }]);
        return () => setBreadcrumbs([]);
    }, [setBreadcrumbs, t]);

    return <>{userInfo.firstname}</>;
}

export default Info;
