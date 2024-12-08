import ContentBlockBreadcrumb from "../../components/content/ContentBlockBreadcrumb.jsx";
import { useTranslation } from "react-i18next";

export default function FieldsOfStudyCurrentList() {
    const { t } = useTranslation();
    return (
        <ContentBlockBreadcrumb
            currentPath={t("fields-current-list")}
        ></ContentBlockBreadcrumb>
    );
}
