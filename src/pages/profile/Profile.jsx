import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ContentBlockProvider } from "../../context/ContentBlockContext.jsx";
import ContentBlockWithMenu from "../../components/ContentBlockWithMenu.jsx";
import { useMemo } from "react";

function Profile() {
    const { t } = useTranslation();

    const items = useMemo(
        () => [
            {
                label: <Link to="info">{t("basic-info")}</Link>,
                path: "info",
                key: 1,
                icon: <UserOutlined />,
            },
            {
                label: <Link to="password">{t("change-password")}</Link>,
                path: "password",
                key: 2,
                icon: <LockOutlined />,
            },
        ],
        [t],
    );
    
    return (
        <ContentBlockProvider mainPath={t("profile")} items={items}>
            <ContentBlockWithMenu />
        </ContentBlockProvider>
    );
}

export default Profile;
