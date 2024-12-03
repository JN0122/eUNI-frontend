import { useTranslation } from "react-i18next";
import ContentBlockWithMenu from "../../components/ContentBlockWithMenu.jsx";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ContentBlockProvider } from "../../hooks/ContentBlockContext.jsx";
import { useUser } from "../../hooks/UserContext.jsx";
import { CalendarOutlined, FileOutlined } from "@ant-design/icons";
import { DrawerProvider } from "../../hooks/DrawerContext.jsx";

function EditSchedule() {
    const { t } = useTranslation();
    const { hasPermission } = useUser();

    const items = useMemo(
        () => [
            hasPermission("classes:*") && {
                label: <Link to="classes">{t("classes")}</Link>,
                path: "classes",
                icon: <CalendarOutlined />,
                key: 1
            },
            hasPermission("assignments:*") && {
                label: <Link to="assignments">{t("assignments")}</Link>,
                path: "assignments",
                icon: <FileOutlined />,
                key: 2
            }
        ],
        [hasPermission, t]
    );

    return (
        <ContentBlockProvider mainPath={t("edit-schedule")} items={items}>
            <DrawerProvider>
                <ContentBlockWithMenu />
            </DrawerProvider>
        </ContentBlockProvider>
    );
}

export default EditSchedule;
