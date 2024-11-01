import ContentBlock from "../components/layout/ContentBlock.jsx";
import SiderMenu from "../components/layout/SiderMenu.jsx";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";

function Profile() {
    const { t } = useTranslation();

    let items = [
        {
            label: t("basic-info"),
            key: 1,
            icon: <UserOutlined />,
        },
        {
            label: t("change-password"),
            key: 2,
            icon: <LockOutlined />,
        },
        {
            label: t("change-email"),
            key: 3,
            icon: <MailOutlined />,
        },
    ];
    return (
        <ContentBlock
            breadcrumbs={[{ title: t("Profil") }]}
            menu={
                <SiderMenu
                    defaultOpenKeys={["sub2"]}
                    fullHeight={true}
                    items={items}
                />
            }
        >
            <Outlet />
        </ContentBlock>
    );
}

export default Profile;
