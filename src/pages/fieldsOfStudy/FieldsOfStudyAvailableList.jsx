import { useTranslation } from "react-i18next";
import ContentBlockBreadcrumb from "../../components/content/ContentBlockBreadcrumb.jsx";

export default function FieldsOfStudyAvailableList() {
    const { t } = useTranslation();
    return (
        <ContentBlockBreadcrumb
            currentPath={t("available-fields")}
        ></ContentBlockBreadcrumb>
    );
}
