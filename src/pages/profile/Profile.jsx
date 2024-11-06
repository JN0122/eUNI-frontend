import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { SubPageProvider } from "../../context/SubPageContentBlockContext.jsx";
import MainpageContentBlock from "../../components/MainpageContentBlock.jsx";
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
        <SubPageProvider mainPath={t("profile")} items={items}>
            <MainpageContentBlock />
        </SubPageProvider>
    );
}

export default Profile;
