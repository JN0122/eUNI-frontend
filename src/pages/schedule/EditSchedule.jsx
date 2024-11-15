import { useTranslation } from "react-i18next";
import ContentBlockWithMenu from "../../components/ContentBlockWithMenu.jsx";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ContentBlockProvider } from "../../context/ContentBlockContext.jsx";

function EditSchedule() {
    const { t } = useTranslation();

    const items = useMemo(
        () => [
            {
                label: <Link to="#">{t("test")}</Link>,
                path: "test",
                key: 1
            }
        ],
        [t]
    );

    return (
        <ContentBlockProvider mainPath={t("edit-schedule")} items={items}>
            <ContentBlockWithMenu />
        </ContentBlockProvider>
    );
}

export default EditSchedule;
