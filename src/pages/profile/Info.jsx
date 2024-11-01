import { useTranslation } from "react-i18next";
import { useSubPage } from "../../context/SubPageContext.jsx";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { Descriptions } from "antd";

function Info() {
    const { t } = useTranslation();
    const { setBreadcrumbs } = useSubPage();
    const { userInfo } = useAuth();

    useEffect(() => {
        setBreadcrumbs([{ title: t("basic-info") }]);
        return () => setBreadcrumbs([]);
    }, [setBreadcrumbs, t]);

    const items = [
        {
            key: "1",
            label: t("given-names"),
            children: userInfo.firstname,
        },
        {
            key: "2",
            label: t("last-name"),
            children: userInfo.lastname,
        },
    ];

    return (
        <>
            <Descriptions title={t("basic-info")} items={items} />
        </>
    );
}

export default Info;
