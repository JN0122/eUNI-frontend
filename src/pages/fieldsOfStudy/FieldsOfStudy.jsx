import { useTranslation } from "react-i18next";
import { BookOutlined } from "@ant-design/icons";
import ContentBlockWithMenu from "../../components/content/ContentBlockWithMenu.jsx";
import { ContentBlockProvider } from "../../hooks/useContentBlock.jsx";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import GraduationCapFilled from "../../components/icons/GraduationCapFilled.jsx";

export default function FieldsOfStudy() {
    const { t } = useTranslation();

    const items = useMemo(
        () => [
            {
                label: (
                    <Link to="current-list">{t("fields-current-list")}</Link>
                ),
                path: "current-list",
                key: 1,
                icon: <GraduationCapFilled />
            },
            {
                label: <Link to="available-list">{t("available-fields")}</Link>,
                path: "available-list",
                key: 2,
                icon: <BookOutlined />
            }
        ],
        [t]
    );

    // <DrawerProvider>
    //     <DrawerNewItemButton label={t("create-field-of-study")} />
    // </DrawerProvider>
    return (
        <ContentBlockProvider mainPath={t("fields-of-study")} items={items}>
            <ContentBlockWithMenu />
        </ContentBlockProvider>
    );
}
